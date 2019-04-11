import { Component } from 'react'
import { div, h, p } from 'react-hyperscript-helpers'
import { Clickable, link } from 'src/components/common'
import FooterWrapper from 'src/components/FooterWrapper'
import Modal from 'src/components/Modal'
import SignInButton from 'src/components/SignInButton'
import signInBg from 'src/images/sign-in-background.jpg'
import colors from 'src/libs/colors'
import { signInLogo } from 'src/libs/logos'
import * as Nav from 'src/libs/nav'


export class CookiesModal extends Component {
  render() {
    const { onDismiss } = this.props
    return h(Modal, {
      showCancel: false,
      onDismiss
    }, [
      'Terra uses cookies to enable sign on and other essential features when signed in, and to provide statistics to our development team regarding how the site is used. For more information, see our ',
      link({
        target: '_blank',
        href: Nav.getLink('privacy')
      }, ['privacy policy.'])
    ])
  }
}

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = { openCookiesModal: false }
  }

  render() {
    const { openCookiesModal } = this.state
    return h(FooterWrapper, [
      div({
        style: {
          flexGrow: 1,
          padding: 82,
          background: `no-repeat left bottom / 1400px url(${signInBg}) #ededed`
        }
      }, [
        div({ style: { maxWidth: 900 } }, [
          signInLogo(),
          div({ style: { fontSize: 54, margin: '1.5rem 0', color: colors.green[0] } }, ['Welcome to Terra']),
          div({ style: { fontSize: 36, fontWeight: 500, color: colors.slate } }, ['New User?']),
          div({ style: { fontSize: 36, marginBottom: '2rem' } }, ['Terra requires a Google Account.']),
          div({ style: { display: 'flex', alignItems: 'center' } }, [
            div({
              style: {
                fontSize: 16, lineHeight: 1.5,
                paddingRight: '1rem', marginRight: '2rem', borderRight:
                  `1px solid ${colors.gray[0]}`
              }
            }, [
              div(['Need to create a TERRA account? Terra uses your Google account.']),
              div({ style: { paddingBottom: '1rem' } },
                ['Once you have signed in and completed the user profile registration step, you can start using TERRA.']
              ),
              link({ target: '_blank', href: 'https://software.broadinstitute.org/firecloud/documentation/article?id=9846' },
                'Learn how to create a Google account with any email address.'
              )
            ]),
            div([
              h(Clickable, {
                style: {
                  color: colors.blue[0],
                  marginLeft: '9rem'
                },
                onClick: () => this.setState({ openCookiesModal: true })
              }, ['Cookies policy']),
              h(SignInButton)
            ])
          ]),
          div({ style: { lineHeight: 1.5, fontSize: 12, marginTop: '3rem' } }, [
            div({ style: { fontWeight: 500 } }, ['WARNING NOTICE']),
            p([
              'You are accessing a US Government web site which may contain information that must be ',
              'protected under the US Privacy Act or other sensitive information and is intended for ',
              'Government authorized use only.'
            ]),
            p([
              'Unauthorized attempts to upload information, change information, or use of this web site ',
              'may result in disciplinary action, civil, and/or criminal penalties. Unauthorized users ',
              'of this website should have no expectation of privacy regarding any communications or ',
              'data processed by this website.'
            ]),
            p([
              'Anyone accessing this website expressly consents to monitoring of their actions and all ',
              'communications or data transiting or stored on related to this website and is advised ',
              'that if such monitoring reveals possible evidence of criminal activity, NIH may provide ',
              'that evidence to law enforcement officials.'
            ]),
            div({ style: { fontWeight: 500 } }, ['WARNING NOTICE (when accessing TCGA controlled data)']),
            p({ style: { fontWeight: 500 } }, [
              'You are reminded that when accessing TCGA controlled access information you are bound by ',
              'the dbGaP TCGA ',
              link({ target: '_blank', href: 'http://cancergenome.nih.gov/pdfs/Data_Use_Certv082014' }, [
                'DATA USE CERTIFICATION AGREEMENT (DUCA)'
              ])
            ])
          ]),
          openCookiesModal && h(CookiesModal, {
            onDismiss: () => this.setState({ openCookiesModal: false })
          })
        ])
      ])
    ])
  }
}
