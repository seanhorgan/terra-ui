import _ from 'lodash/fp'
import { Fragment } from 'react'
import { div, h } from 'react-hyperscript-helpers'
import { PageBox, search, spinnerOverlay } from 'src/components/common'
import { DeleteUserModal, EditUserModal, MemberCard, NewUserCard, NewUserModal } from 'src/components/group-common'
import TopBar from 'src/components/TopBar'
import { ajaxCaller } from 'src/libs/ajax'
import { reportError } from 'src/libs/error'
import * as Nav from 'src/libs/nav'
import * as StateHistory from 'src/libs/state-history'
import * as Style from 'src/libs/style'
import * as Utils from 'src/libs/utils'
import { Component } from 'src/libs/wrapped-components'


export const GroupDetails = ajaxCaller(class GroupDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      members: null,
      creatingNewUser: false,
      editingUser: false,
      deletingUser: false,
      updating: false,
      ...StateHistory.get()
    }
  }

  async refresh() {
    const { groupName, ajax: { Groups } } = this.props

    try {
      this.setState({ loading: true, creatingNewUser: false, editingUser: false, deletingUser: false, updating: false })

      const groupAjax = Groups.group(groupName)
      const [membersEmails, adminsEmails] = await Promise.all([groupAjax.listMembers(), groupAjax.listAdmins()])

      const rolesByMember = _.mergeAllWith((a, b) => { if (_.isArray(a)) return a.concat(b) }, [
        _.fromPairs(_.map(email => [email, ['admin']], adminsEmails)),
        _.fromPairs(_.map(email => [email, ['member']], membersEmails))
      ])
      const members = _.flow(
        _.toPairs,
        _.map(([email, roles]) => ({ email, roles })),
        _.sortBy(member => member.email.toUpperCase())
      )(rolesByMember)
      this.setState({ members, adminCanEdit: adminsEmails.length > 1 })
    } catch (error) {
      reportError('Error loading group list', error)
    } finally {
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    this.refresh()
  }

  render() {
    const { members, adminCanEdit, loading, filter, creatingNewUser, editingUser, deletingUser, updating } = this.state
    const { groupName, ajax: { Groups } } = this.props

    return h(Fragment, [
      h(TopBar, { title: 'Groups', href: Nav.getLink('groups') }, [
        search({
          wrapperProps: { style: { marginLeft: '2rem', flexGrow: 1, maxWidth: 500 } },
          inputProps: {
            placeholder: 'SEARCH GROUP',
            onChange: e => this.setState({ filter: e.target.value }),
            value: filter
          }
        })
      ]),
      h(PageBox, [
        div({ style: Style.cardList.toolbarContainer }, [
          div({ style: { ...Style.elements.sectionHeader, textTransform: 'uppercase' } }, [
            `Group Management: ${groupName}`
          ])
        ]),
        div({ style: Style.cardList.cardContainer }, [
          h(NewUserCard, {
            onClick: () => this.setState({ creatingNewUser: true })
          }),
          div({ style: { flexGrow: 1 } },
            _.map(member => {
              return h(MemberCard, {
                adminLabel: 'admin',
                userLabel: 'member',
                member, adminCanEdit,
                onEdit: () => this.setState({ editingUser: member }),
                onDelete: () => this.setState({ deletingUser: member })
              })
            }, _.filter(({ email }) => Utils.textMatch(filter, email), members))
          ),
          loading && spinnerOverlay
        ]),
        creatingNewUser && h(NewUserModal, {
          adminLabel: 'admin',
          userLabel: 'member',
          title: 'Add user to Terra Group',
          addFunction: Groups.group(groupName).addUser,
          onDismiss: () => this.setState({ creatingNewUser: false }),
          onSuccess: () => this.refresh()
        }),
        editingUser && h(EditUserModal, {
          adminLabel: 'admin',
          userLabel: 'member',
          user: editingUser,
          saveFunction: Groups.group(groupName).changeUserRoles,
          onDismiss: () => this.setState({ editingUser: false }),
          onSuccess: () => this.refresh()
        }),
        deletingUser && h(DeleteUserModal, {
          userEmail: deletingUser.email,
          onDismiss: () => this.setState({ deletingUser: false }),
          onSubmit: async () => {
            try {
              this.setState({ updating: true, deletingUser: false })
              await Groups.group(groupName).removeUser(deletingUser.roles, deletingUser.email)
              this.refresh()
            } catch (error) {
              this.setState({ updating: false })
              reportError('Error removing member from group', error)
            }
          }
        }),
        updating && spinnerOverlay
      ])
    ])
  }

  componentDidUpdate() {
    StateHistory.update(_.pick(
      ['members', 'filter'],
      this.state)
    )
  }
})


export const addNavPaths = () => {
  Nav.defPath('group', {
    path: '/groups/:groupName',
    component: GroupDetails,
    title: ({ groupName }) => `Group Management - ${groupName}`
  })
}
