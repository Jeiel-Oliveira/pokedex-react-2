"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _isUndefined2 = _interopRequireDefault(require("lodash/isUndefined"));

var _startsWith2 = _interopRequireDefault(require("lodash/startsWith"));

var _filter2 = _interopRequireDefault(require("lodash/filter"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var _intersection2 = _interopRequireDefault(require("lodash/intersection"));

var _has2 = _interopRequireDefault(require("lodash/has"));

var _each2 = _interopRequireDefault(require("lodash/each"));

var _invoke2 = _interopRequireDefault(require("lodash/invoke"));

var _react = _interopRequireDefault(require("react"));

var getDefaultPropName = function getDefaultPropName(prop) {
  return "default" + (prop[0].toUpperCase() + prop.slice(1));
};
/**
 * Return the auto controlled state value for a give prop. The initial value is chosen in this order:
 *  - regular props
 *  - then, default props
 *  - then, initial state
 *  - then, `checked` defaults to false
 *  - then, `value` defaults to '' or [] if props.multiple
 *  - else, undefined
 *
 *  @param {string} propName A prop name
 *  @param {object} [props] A props object
 *  @param {object} [state] A state object
 *  @param {boolean} [includeDefaults=false] Whether or not to heed the default props or initial state
 */


var getAutoControlledStateValue = function getAutoControlledStateValue(propName, props, state, includeDefaults) {
  if (includeDefaults === void 0) {
    includeDefaults = false;
  }

  // regular props
  var propValue = props[propName];
  if (propValue !== undefined) return propValue;

  if (includeDefaults) {
    // defaultProps
    var defaultProp = props[getDefaultPropName(propName)];
    if (defaultProp !== undefined) return defaultProp; // initial state - state may be null or undefined

    if (state) {
      var initialState = state[propName];
      if (initialState !== undefined) return initialState;
    }
  } // React doesn't allow changing from uncontrolled to controlled components,
  // default checked/value if they were not present.


  if (propName === 'checked') return false;
  if (propName === 'value') return props.multiple ? [] : ''; // otherwise, undefined
};

var ModernAutoControlledComponent = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(ModernAutoControlledComponent, _React$Component);

  function ModernAutoControlledComponent() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    var _this$constructor = _this.constructor,
        autoControlledProps = _this$constructor.autoControlledProps,
        getAutoControlledStateFromProps = _this$constructor.getAutoControlledStateFromProps;
    var state = (0, _invoke2.default)((0, _assertThisInitialized2.default)(_this), 'getInitialAutoControlledState', _this.props) || {};

    if (process.env.NODE_ENV !== 'production') {
      var _this$constructor2 = _this.constructor,
          defaultProps = _this$constructor2.defaultProps,
          name = _this$constructor2.name,
          propTypes = _this$constructor2.propTypes,
          getDerivedStateFromProps = _this$constructor2.getDerivedStateFromProps; // require usage of getAutoControlledStateFromProps()

      if (getDerivedStateFromProps !== ModernAutoControlledComponent.getDerivedStateFromProps) {
        /* eslint-disable-next-line no-console */
        console.error("Auto controlled " + name + " must specify a static getAutoControlledStateFromProps() instead of getDerivedStateFromProps().");
      } // require propTypes


      (0, _each2.default)(autoControlledProps, function (prop) {
        var defaultProp = getDefaultPropName(prop); // regular prop

        if (!(0, _has2.default)(propTypes, defaultProp)) {
          console.error(name + " is missing \"" + defaultProp + "\" propTypes validation for auto controlled prop \"" + prop + "\".");
        } // its default prop


        if (!(0, _has2.default)(propTypes, prop)) {
          console.error(name + " is missing propTypes validation for auto controlled prop \"" + prop + "\".");
        }
      }); // prevent autoControlledProps in defaultProps
      //
      // When setting state, auto controlled props values always win (so the parent can manage them).
      // It is not reasonable to decipher the difference between props from the parent and defaultProps.
      // Allowing defaultProps results in trySetState always deferring to the defaultProp value.
      // Auto controlled props also listed in defaultProps can never be updated.
      //
      // To set defaults for an AutoControlled prop, you can set the initial state in the
      // constructor or by using an ES7 property initializer:
      // https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers

      var illegalDefaults = (0, _intersection2.default)(autoControlledProps, (0, _keys2.default)(defaultProps));

      if (!(0, _isEmpty2.default)(illegalDefaults)) {
        console.error(['Do not set defaultProps for autoControlledProps. You can set defaults by', 'setting state in the constructor or using an ES7 property initializer', '(https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers)', "See " + name + " props: \"" + illegalDefaults + "\"."].join(' '));
      } // prevent listing defaultProps in autoControlledProps
      //
      // Default props are automatically handled.
      // Listing defaults in autoControlledProps would result in allowing defaultDefaultValue props.


      var illegalAutoControlled = (0, _filter2.default)(autoControlledProps, function (prop) {
        return (0, _startsWith2.default)(prop, 'default');
      });

      if (!(0, _isEmpty2.default)(illegalAutoControlled)) {
        console.error(['Do not add default props to autoControlledProps.', 'Default props are automatically handled.', "See " + name + " autoControlledProps: \"" + illegalAutoControlled + "\"."].join(' '));
      }
    } // Auto controlled props are copied to state.
    // Set initial state by copying auto controlled props to state.
    // Also look for the default prop for any auto controlled props (foo => defaultFoo)
    // so we can set initial values from defaults.


    var initialAutoControlledState = autoControlledProps.reduce(function (acc, prop) {
      acc[prop] = getAutoControlledStateValue(prop, _this.props, state, true);

      if (process.env.NODE_ENV !== 'production') {
        var defaultPropName = getDefaultPropName(prop);
        var _name = _this.constructor.name; // prevent defaultFoo={} along side foo={}

        if (!(0, _isUndefined2.default)(_this.props[defaultPropName]) && !(0, _isUndefined2.default)(_this.props[prop])) {
          console.error(_name + " prop \"" + prop + "\" is auto controlled. Specify either " + defaultPropName + " or " + prop + ", but not both.");
        }
      }

      return acc;
    }, {});
    _this.state = (0, _extends2.default)({}, state, initialAutoControlledState, {
      autoControlledProps: autoControlledProps,
      getAutoControlledStateFromProps: getAutoControlledStateFromProps
    });
    return _this;
  }

  ModernAutoControlledComponent.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    var autoControlledProps = state.autoControlledProps,
        getAutoControlledStateFromProps = state.getAutoControlledStateFromProps; // Solve the next state for autoControlledProps

    var newStateFromProps = autoControlledProps.reduce(function (acc, prop) {
      var isNextDefined = !(0, _isUndefined2.default)(props[prop]); // if next is defined then use its value

      if (isNextDefined) acc[prop] = props[prop];
      return acc;
    }, {}); // Due to the inheritance of the AutoControlledComponent we should call its
    // getAutoControlledStateFromProps() and merge it with the existing state

    if (getAutoControlledStateFromProps) {
      var computedState = getAutoControlledStateFromProps(props, (0, _extends2.default)({}, state, newStateFromProps), state); // We should follow the idea of getDerivedStateFromProps() and return only modified state

      return (0, _extends2.default)({}, newStateFromProps, computedState);
    }

    return newStateFromProps;
  }
  /**
   * Override this method to use getDerivedStateFromProps() in child components.
   */
  ;

  ModernAutoControlledComponent.getAutoControlledStateFromProps = function getAutoControlledStateFromProps() {
    return null;
  };

  return ModernAutoControlledComponent;
}(_react.default.Component);

exports.default = ModernAutoControlledComponent;