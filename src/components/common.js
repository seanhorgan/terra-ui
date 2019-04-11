import _ from 'lodash/fp'
import marked from 'marked'
import { Fragment, useState } from 'react'
import { div, h, input, label, span } from 'react-hyperscript-helpers'
import Interactive from 'react-interactive'
import RSelect from 'react-select'
import { centeredSpinner, icon } from 'src/components/icons'
import TooltipTrigger from 'src/components/TooltipTrigger'
import { logo } from 'src/libs/logos'
import colors from 'src/libs/colors'
import { getConfig } from 'src/libs/config'
import * as Style from 'src/libs/style'


const styles = {
  button: {
    display: 'inline-flex', justifyContent: 'space-around', alignItems: 'center', height: '2.25rem',
    fontWeight: 500, fontSize: 14, textTransform: 'uppercase', whiteSpace: 'nowrap',
    userSelect: 'none'
  }
}

export const Clickable = ({ as = 'div', disabled, tooltip, tooltipSide, onClick, children, ...props }) => {
  const child = h(Interactive, _.merge({
    as, disabled,
    onClick: (...args) => onClick && !disabled && onClick(...args)
  }, props), [children])

  if (tooltip) {
    return h(TooltipTrigger, { content: tooltip, side: tooltipSide }, [child])
  } else {
    return child
  }
}

const linkProps = disabled => ({
  as: 'a',
  style: {
    color: disabled ? colors.gray[2] : colors.green[0],
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500
  },
  hover: disabled ? undefined : { color: colors.green[1] }
})

export const link = function(props, children) {
  return h(Interactive,
    _.merge(linkProps(props.disabled), props),
    children)
}

export const linkButton = (props, children) => {
  return h(Clickable,
    _.merge(linkProps(props.disabled), props),
    children)
}

export const buttonPrimary = ({ disabled, ...props }, children) => {
  return h(Clickable, _.merge({
    disabled,
    style: {
      ...styles.button,
      border: `1px solid ${disabled ? colors.gray[4] : colors.green[0]}`,
      borderRadius: 5, color: 'white', padding: '0.875rem',
      backgroundColor: disabled ? colors.gray[5] : colors.green[1],
      cursor: disabled ? 'not-allowed' : 'pointer'
    },
    hover: disabled ? undefined : { backgroundColor: colors.green[2] }
  }, props), children)
}

export const buttonSecondary = ({ disabled, ...props }, children) => {
  return h(Clickable, _.merge({
    disabled,
    style: {
      ...styles.button,
      color: disabled ? colors.gray[2] : colors.green[0],
      cursor: disabled ? 'not-allowed' : 'pointer'
    },
    hover: disabled ? undefined : { color: colors.green[1] }
  }, props), children)
}

export const buttonOutline = ({ disabled, ...props }, children) => {
  return h(buttonPrimary, _.merge({
    style: {
      border: `1px solid ${disabled ? colors.gray[4] : colors.green[0]}`,
      color: colors.green[0],
      backgroundColor: disabled ? colors.gray[5] : 'white'
    },
    hover: disabled ? undefined : { backgroundColor: colors.green[6] }
  }, props), children)
}

export const search = function({ wrapperProps, inputProps }) {
  return div(
    _.merge({ style: { padding: '0.5rem 0.2rem', display: 'flex', backgroundColor: 'white', borderRadius: 3 } },
      wrapperProps),
    [
      icon('search', { size: 21 }),
      input(_.merge({
        style: {
          border: 'none', outline: 'none',
          flexGrow: 1,
          verticalAlign: 'bottom', marginLeft: '1rem',
          fontSize: '1rem',
          backgroundColor: 'transparent'
        }
      }, inputProps))
    ])
}

export const tabBar = ({ activeTab, tabNames, refresh = _.noop, getHref }, children = []) => {
  const navTab = currentTab => {
    const selected = currentTab === activeTab
    const href = getHref(currentTab)

    return h(Fragment, [
      h(Interactive, {
        as: 'a',
        style: { ...Style.tabBar.tab, ...(selected ? Style.tabBar.active : {}) },
        hover: selected ? {} : Style.tabBar.hover,
        onClick: href === window.location.hash ? refresh : undefined,
        href
      }, [div({ style: { marginBottom: selected ? -(Style.tabBar.active.borderBottomWidth) : undefined } }, currentTab)])
    ])
  }

  return div({ style: Style.tabBar.container }, [
    ..._.map(name => navTab(name), tabNames),
    div({ style: { flexGrow: 1 } }),
    ...children
  ])
}

export const menuIcon = (iconName, props) => {
  return icon(iconName, _.merge({ size: 15, style: { marginRight: '.5rem' } }, props))
}

export const MenuButton = ({ disabled, children, ...props }) => {
  return h(Clickable, _.merge({
    disabled,
    style: {
      display: 'flex', alignItems: 'center',
      fontSize: 12, minWidth: 125, height: '2.25rem',
      color: disabled ? colors.gray[2] : undefined,
      padding: '0.875rem',
      cursor: disabled ? 'not-allowed' : 'pointer'
    },
    hover: !disabled ? { backgroundColor: colors.grayBlue[5], color: colors.green[0] } : undefined
  }, props), [children])
}

export const Checkbox = ({ checked, onChange, disabled, ...props }) => {
  return h(Interactive, _.merge({
    as: 'span',
    role: 'checkbox',
    'aria-checked': checked,
    onClick: () => onChange && !disabled && onChange(!checked),
    style: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      color: disabled ? colors.gray[4] : checked ? colors.green[0] : colors.gray[3]
    },
    hover: disabled ? undefined : { color: colors.green[1] },
    active: disabled ? undefined : { backgroundColor: colors.green[6] },
    disabled
  }, props), [
    icon(checked ? 'checkSquare' : 'square', { size: 16 })
  ])
}

export const LabeledCheckbox = ({ checked, onChange, disabled, children, ...props }) => {
  return h(Fragment, [
    h(Checkbox, { checked, onChange, disabled, ...props }),
    h(Interactive, {
      as: 'span',
      style: {
        verticalAlign: 'middle',
        color: disabled ? colors.gray[2] : undefined,
        cursor: disabled ? 'default' : 'pointer'
      },
      onClick: () => onChange && !disabled && onChange(!checked),
      disabled
    }, [children])
  ])
}

export const RadioButton = ({ text, labelStyle, ...props }) => {
  const id = `${text}-radio-button`

  return h(Fragment, [
    input({
      type: 'radio', id,
      name: id, // not semantically correct, but fixes a focus cycle issue
      ...props
    }),
    label({ htmlFor: id, style: labelStyle }, text)
  ])
}

export const spinnerDefault = ({ outerStyles = {}, innerStyles = {} }) => div(
  {
    style: {
      position: 'absolute',
      display: 'flex', alignItems: 'center',
      top: 0, right: 0, bottom: 0, left: 0,
      zIndex: 9999, // make sure it's on top of any third party components with z-indicies
      ...outerStyles
    }
  }, [
    centeredSpinner({
      size: 64,
      style: { backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '1rem', borderRadius: '0.5rem', ...innerStyles }
    })
  ]
)

export const spinnerOverlay = spinnerDefault({ outerStyles: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } })

export const transparentSpinnerOverlay = spinnerDefault({ innerStyles: { backgroundColor: 'rgba(255, 255, 255, 0.0)' } })

export const topSpinnerOverlay = spinnerDefault({ outerStyles: { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, innerStyles: { marginTop: 150 } })

export const comingSoon = span({
  style: {
    margin: '0.5rem', padding: 3, borderRadius: 2,
    backgroundColor: colors.grayBlue[0], color: colors.gray[0],
    fontSize: '75%', textTransform: 'uppercase', fontWeight: 500,
    whiteSpace: 'nowrap', lineHeight: 1
  }
}, ['coming soon'])

/**
 * @param {Object} props - see {@link https://react-select.com/props#select-props}
 * @param props.value - a member of options
 * @param {Array} props.options - can be of any type; if objects, they should each contain a value and label, unless defining getOptionLabel
 */
export const Select = ({ value, options, id, ...props }) => {
  const newOptions = options && !_.isObject(options[0]) ? _.map(value => ({ value }), options) : options
  const findValue = target => _.find({ value: target }, newOptions)
  const newValue = props.isMulti ? _.map(findValue, value) : findValue(value)

  return h(RSelect, _.merge({
    inputId: id,
    theme: base => _.merge(base, {
      colors: {
        primary: colors.green[0],
        neutral20: colors.gray[3],
        neutral30: colors.gray[3]
      },
      spacing: { controlHeight: 36 }
    }),
    styles: {
      control: (base, { isDisabled }) => _.merge(base, {
        backgroundColor: isDisabled ? colors.gray[5] : 'white',
        boxShadow: 'none'
      }),
      singleValue: base => ({ ...base, color: colors.gray[0] }),
      option: (base, { isSelected, isFocused, isDisabled }) => _.merge(base, {
        backgroundColor: isSelected ? colors.grayBlue[5] : isFocused ? colors.grayBlue[3] : undefined,
        color: isSelected ? colors.green[0] : isDisabled ? undefined : colors.gray[0],
        ':active': { backgroundColor: isSelected ? colors.green[4] : colors.green[5] }
      }),
      clearIndicator: base => ({ ...base, paddingRight: 0 }),
      indicatorSeparator: () => ({ display: 'none' }),
      dropdownIndicator: base => _.merge(base, { paddingLeft: props.isClearable ? 0 : undefined }),
      multiValueRemove: base => _.merge(base, { ':hover': { backgroundColor: 'unset' } })
    },
    getOptionLabel: ({ value, label }) => label || value.toString(),
    value: newValue || null, // need null instead of undefined to clear the select
    options: newOptions
  }, props))
}

export const PageBox = ({ children, style = {} }) => {
  return div({
    style: {
      margin: '1.5rem', padding: '1.5rem 1.5rem 0', minHeight: 125, flex: 'none', ...style
    }
  }, [children])
}

export const backgroundLogo = () => logo({
  size: 1200,
  style: { position: 'fixed', top: -100, left: -100, zIndex: -1, opacity: 0.65 }
})

export const methodLink = config => {
  const { methodRepoMethod: { sourceRepo, methodVersion, methodNamespace, methodName, methodPath } } = config
  return sourceRepo === 'agora' ?
    `${getConfig().firecloudUrlRoot}/?return=terra#methods/${methodNamespace}/${methodName}/${methodVersion}` :
    `${getConfig().dockstoreUrlRoot}/workflows/${methodPath}`
}

/**
 * WARNING: Be very careful when using custom renderers because they may override marked's built-in
 * content sanitization.
 * @param {string} children markdown content
 * @param renderers element-specific renderers
 * @param props properties for wraper div
 * @returns {object} div containing rendered markdown
 * @constructor
 */
export const Markdown = ({ children, renderers = {}, ...props }) => {
  const content = marked(children, {
    renderer: Object.assign(new marked.Renderer(), renderers)
  })
  return div({ className: 'markdown-body', ...props, dangerouslySetInnerHTML: { __html: content } })
}

export const IdContainer = ({ children }) => {
  const [id] = useState(() => _.uniqueId('element-'))
  return children(id)
}
