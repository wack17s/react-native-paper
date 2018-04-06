import * as React from 'react';
import { Animated } from 'react-native';

type Theme = {
    dark: boolean;
    roundness: number,
    colors: {
      primary: string,
      background: string,
      paper: string,
      accent: string,
      text: string,
      disabled: string,
      placeholder: string
    },
    fonts: {
      regular: string,
      medium: string,
      light: string,
      thin: string
    }
}

type IconSource = string | { uri: string } | number | React.ReactNode;

type Route = {
    key: string,
    title?: string,
    icon?: IconSource,
    color?: string,
};

type NavigationState<T> = {
    index: number,
    routes: Array<T>,
};

export interface IBottomNavigationProps<T> {
    /**
     * Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label.
     * By default, this is `true` when you have more than 3 tabs.
     */
    shifting?: boolean;
    /**
     * State for the bottom navigation. The state should contain the following properties:
     *
     * - `index`: a number reprsenting the index of the active route in the `routes` array
     * - `routes`: an array containing a list of route objects used for rendering the tabs
     *
     * Each route object should contain the following properties:
     *
     * - `key`: a unique key to identify the route (required)
     * - `title`: title of the route to use as the tab label
     * - `icon`: icon to use as the tab icon, can be a string, an image source or a react component
     * - `color`: color to use as background color for shifting bottom navigation
     *
     * Example:
     *
     * ```js
     * {
     *   index: 1,
     *   routes: [
     *     { key: 'music', title: 'Music', icon: 'queue-music', color: '#3F51B5' },
     *     { key: 'albums', title: 'Albums', icon: 'album', color: '#009688' },
     *     { key: 'recents', title: 'Recents', icon: 'history', color: '#795548' },
     *     { key: 'purchased', title: 'Purchased', icon: 'shopping-cart', color: '#607D8B' },
     *   ]
     * }
     * ```
     *
     * `BottomNavigation` is a controlled component, which means the `index` needs to be updated via the `onIndexChange` callback.
     */
    navigationState: NavigationState<T>;
    /**
     * Callback which is called on tab change, receives the index of the new tab as argument.
     * The navigation state needs to be updated when it's called, otherwise the change is dropped.
     */
    onIndexChange: (index: number) => {};
    /**
     * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument:
     *
     * ```js
     * renderScene = ({ route, jumpTo }) => {
     *   switch (route.key) {
     *     case 'music':
     *       return <MusicRoute jumpTo={jumpTo} />;
     *     case 'albums':
     *       return <AlbumsRoute jumpTo={jumpTo} />;
     *   }
     * }
     * ```
     *
     * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
     * After initial render, all the pages stay rendered to preserve their state.
     *
     * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
     * To make it easier to specify the components, you can use the `SceneMap` helper:
     *
     * ```js
     * renderScene = BottomNavigation.SceneMap({
     *   music: MusicRoute,
     *   albums: AlbumsRoute,
     * });
     * ```
     *
     * Specifying the components this way is easier and takes care of implementing a `shouldComponentUpdate` method.
     * Each component will receive the current route and a `jumpTo` method as it's props.
     * The `jumpTo` method can be used to navigate to other tabs programmatically:
     *
     * ```js
     * this.props.jumpTo('albums')
     * ```
     */
    renderScene: (props: {
      route: T,
      jumpTo: (key: string) => {},
    }) => !React.ReactNode;
    /**
     * Callback which returns a React Element to be used as tab icon.
     */
    renderIcon?: (props: {
      route: T,
      focused: boolean,
      tintColor: string,
    }) => React.ReactNode;
    /**
     * Callback which React Element to be used as tab label.
     */
    renderLabel?: (props: {
      route: T,
      focused: boolean,
      tintColor: string,
    }) => React.ReactNode;
    /**
     * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
     */
    getLabelText?: (props: { route: T }) => string;
    /**
     * Get color for the tab, uses `route.color` by default.
     */
    getColor?: (props: { route: T }) => string;
    /**
     * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
     */
    onTabPress?: (props: { route: T }) => {};
    /**
     * Style for the bottom navigation bar.
     * You can set a bottom padding here if you have a translucent navigation bar on Android:
     *
     * ```js
     * barStyle={{ paddingBottom: 48 }}
     * ```
     */
    barStyle?: any;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
};
export interface IBottomNavigationState {
    /**
     * Active state of individual tab items, active state is 1 and inactve state is 0.
     */
    tabs: Animated.Value[];
    /**
     * The amount of horizontal shift for each tab item.
     */
    shifts: Animated.Value[];
    /**
     * Index of the currently active tab. Used for setting the background color.
     * Use don't use the color as an animated value directly, because `setValue` seems to be buggy with colors.
     */
    index: Animated.Value;
    /**
     * Animation for the background color ripple, used to determine it's scale and opacity.
     */
    ripple: Animated.Value;
    /**
     * Animation for the touch feedback, used to determine it's scale and opacity.
     */
    touch: Animated.Value;
    /**
     * Layout of the tab bar. The width is used to determine the size and position of the ripple.
     */
    layout: { height: number, width: number, measured: boolean };
    /**
     * Currently active index. Used only for getDerivedStateFromProps.
     */
    current: number;
    /**
     * Previously active index. Used to determine the position of the ripple.
     */
    previous: number;
    /**
     * List of loaded tabs, tabs will be loaded when navigated to.
     */
    loaded: number[];
};
export class BottomNavigation<T = Route> extends React.Component<IBottomNavigationProps<T>, IBottomNavigationState> {}

export interface IButtonProps {
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Use a compact look, useful for flat buttons in a row.
     */
    compact?: boolean;
    /**
     * Add elevation to button, as opposed to default flat appearance. Typically used on a flat surface.
     */
    raised?: boolean;
    /**
     * Use to primary color from theme. Typically used to emphasize an action.
     */
    primary?: boolean;
    /**
     * Text color of button, a dark button will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean;
    /**
     * Name of the icon. Can be a string, an image source or a react component.
     */
    icon?: IconSource;
    /**
     * Custom text color for flat button, or background color for raised button.
     */
    color?: string;
    /**
     * Label text of the button.
     */
    children: string | string[];
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export interface IButtonState {
    elevation: Animated.Value
}
export class Button extends React.Component<IButtonProps, IButtonState> {}

export interface ICardProps {
    /**
     * Resting elevation of the card which controls the drop shadow.
     */
    elevation?: number;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Content of the `Card`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export interface ICardState {
    elevation: Animated.Value
}
export class Card extends React.Component<ICardProps, ICardState> {}

export interface ICardActionsProps {
    /**
     * Content of the `CardActions`.
     */
    children: React.ReactNode;
    style?: any;
}
export class CardActions extends React.Component<ICardActionsProps> {}

export interface ICardContentProps {
    /**
     * @internal
     */
    index?: number;
    /**
     * @internal
     */
    total?: number;
    /**
     * @internal
     */
    siblings?: string[];
    style?: any;
  }
export class CardContent extends React.Component<ICardContentProps> {}

export interface ICardCoverProps {
    /**
     * @internal
     */
    index?: number;
    /**
     * @internal
     */
    total?: number;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class CardCover extends React.Component<ICardCoverProps> {}

export interface ICheckboxProps {
    /**
     * Whether checkbox is checked.
     */
    checked: boolean;
    /**
     * Whether checkbox is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Custom color for checkbox.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: Theme;
}
export interface ICheckboxState {
    scaleAnim: Animated.Value;
}
export class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {}

export interface IDialogProps {
    /**
     * Determines whether clicking outside the dialog dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the dialog.
     */
    onDismiss: () => void;
    /**
     * Determines Whether the dialog is visible.
     */
    visible: boolean;
    /**
     * Content of the `Dialog`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class Dialog extends React.Component<IDialogProps, void> {}

export interface IDialogActionsProps {
    /**
     * Content of the `DialogActions`.
     */
    children: React.ReactNode;
    style?: any;
}
export class DialogActions extends React.Component<IDialogActionsProps> {}

export interface IDialogContentProps {
    /**
     * Content of the `DialogContent`.
     */
    children: React.ReactNode;
    style?: any;
}
export class DialogContent extends React.Component<IDialogContentProps> {}

export interface IDialogScrollAreaProps {
    /**
     * Content of the `DialogScrollArea`.
     */
    children: React.ReactNode;
    style?: any;
}
export class DialogScrollArea extends React.Component<IDialogScrollAreaProps> {}

export interface IDialogTitleProps {
    /**
     * Title text for the `DialogTitle`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class DialogTitle extends React.Component<IDialogTitleProps> {}

export interface IDividerProps {
    /**
     *  Whether divider has a left inset.
     */
    inset?: boolean;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class Divider extends React.Component<IDividerProps> {}

export interface IDrawerItemProps {
    /**
     * The label text of the item.
     */
    label: string;
    /**
     * Name of the icon. Can be a string (name of `MaterialIcon`),
     * an object of shape `{ uri: 'https://path.to' }`,
     * a local image: `require('../path/to/image.png')`,
     * or a valid React Native component.
     */
    icon?: IconSource;
    /**
     * Whether to highlight the drawer item as active.
     */
    active?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Custom color for the drawer text and icon.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: Theme;
}
export class DrawerItem extends React.Component<IDrawerItemProps> {}

export interface IDrawerSectionProps {
    /**
     * Title to show as the header for the section.
     */
    title?: string;
    /**
     * Content of the `DrawerSection`.
     */
    children: React.ReactNode;
    /**
     * @optional
     */
    theme?: Theme;
}
export class DrawerSection extends React.Component<IDrawerSectionProps> {}

export interface IFABProps {
    /**
     *  Whether FAB is mini-sized, used to create visual continuity with other elements.
     */
    small?: boolean;
    /**
     * Icon color of button, a dark button will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Name of the icon. Can be a string (name of `MaterialIcon`),
     * an object of shape `{ uri: 'https://path.to' }`,
     * a local image: `require('../path/to/image.png')`,
     * or a valid React Native component.
     */
    icon: IconSource;
    /**
     * Custom color for the FAB.
     */
    color?: string;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class FAB extends React.Component<IFABProps> {}

export interface IModalProps {
    /**
     * Determines whether clicking outside the modal dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the modal.
     */
    onDismiss: () => void;
    /**
     * Determines Whether the modal is visible.
     */
    visible?: boolean;
    /**
     * Content of the `Modal`.
     */
    children: React.ReactNode;
};
export interface IModalState {
    opacity: Animated.Value;
    rendered: boolean;
}
export class Modal extends React.Component<IModalProps, IModalState> {}

export interface IPaperProps {
    /**
     * Content of the `Paper`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class Paper extends React.Component<IPaperProps> {}

export interface ProgressBarProps {
    /**
     * Progress value (between 0 and 1).
     */
    progress: number;
    /**
     * Color of the progress bar.
     */
    color?: string;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class ProgressBar extends React.Component<ProgressBarProps> {}

export interface IRadioButtonProps {
    /**
     * Value of the radio button
     */
    value: string;
    /**
     * Whether radio is checked.
     */
    checked?: boolean;
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Custom color for radio.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: Theme;
}
export interface IRadioButtonState {
    borderAnim: Animated.Value;
    radioAnim: Animated.Value;
}
export class RadioButton extends React.Component<IRadioButtonProps, IRadioButtonState> {}

export interface RadioButtonGroupProps {
    /**
     * Function to execute on selection change.
     */
    onValueChange: (value: string) => {};
    /**
     * Value of the currently selected radio button.
     */
    value: string;
    /**
     * React elements containing radio buttons.
     */
    children: React.ReactNode;
}
export class RadioButtonGroup extends React.Component<RadioButtonGroupProps> {}

export interface ISearchBarProps {
    /**
     * Hint text shown when the input is empty.
     */
    placeholder?: string;
    /**
     * The value of the text input.
     */
    value: string;
    /**
     * Icon name for the left icon button (see `onIconPress`).
     */
    icon?: IconSource;
    /**
     * Callback that is called when the text input's text changes.
     */
    onChangeText: (query: string) => void;
    /**
     * Callback to execute if we want the left icon to act as button.
     */
    onIconPress?: () => void;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class SearchBar extends React.Component<ISearchBarProps> {}

export interface ISwitchProps {
  /**
   * Disable toggling the switch.
   */
  disabled?: boolean;
  /**
   * Switch value- true or false.
   */
  value?: boolean;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: (checked: boolean) => void;
  style?: any;
  /**
   * @optional
   */
  theme?: Theme;
}
export class Switch extends React.Component<ISwitchProps> {}

export interface IToolbarProps {
    /**
     * Theme color for the toolbar, a dark toolbar will render light text and vice-versa
     * Child elements can override this prop independently.
     */
    dark?: boolean;
    /**
     * Extra padding to add at the top of toolbar to account for translucent status bar.
     * This is automatically handled on iOS including iPhone X.
     * If you are using Android and use Expo, we assume translucent status bar and set a height for status bar automatically.
     * Pass `0` or a custom value to disable the default behaviour.
     */
    statusBarHeight?: number;
    /**
     * Content of the `Toolbar`.
     */
    children: React.ReactNode;
    /**
     * @optional
     */
    theme?: Theme;
    style?: any;
}
export class Toolbar extends React.Component<IToolbarProps> {}

export interface IToolbarActionProps {
    /**
     * Theme color for the action icon, a dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     * Name of the icon to show.
     */
    icon: IconSource;
    /**
     * Optional icon size, defaults to 24.
     */
    size?: number;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: any;
}
export class ToolbarAction extends React.Component<IToolbarActionProps> {}

export interface IToolbarBackActionProps {
    /**
     * Theme color for the back icon, a dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: any;
}
export class ToolbarBackAction extends React.Component<IToolbarBackActionProps> {}

export interface IToolbarContentProps {
    /**
     * Theme color for the text, a dark toolbar will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Text for the title.
     */
    title: string | React.ReactNode;
    /**
     * Style for the title.
     */
    titleStyle?: any;
    /**
     * Text for the subtitle.
     */
    subtitle?: string | React.ReactNode;
    /**
     * Style for the subtitle.
     */
    subtitleStyle?: any;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class ToolbarContent extends React.Component<IToolbarContentProps> {}

export interface ITouchableRippleProps {
    /**
     * Whether to render the ripple outside the view bounds.
     */
    borderless?: boolean;
    /**
     * Type of background drawabale to display the feedback.
     * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
     */
    background?: object;
    /**
     * Whether to prevent interaction with the touchable.
     */
    disabled?: boolean;
    /**
     * Function to execute on press. If not set, will cause the touchable to be disabled.
     */
    onPress?: () => void;
    /**
     * Color of the ripple effect.
     */
    rippleColor?: string;
    /**
     * Color of the underlay for the highlight effect.
     */
    underlayColor?: string;
    /**
     * Content of the `TouchableRipple`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class TouchableRipple extends React.Component<ITouchableRippleProps, void> {}

export interface ITextInputProps {
    /**
     * If true, user won't be able to interact with the component.
     */
    disabled?: boolean;
    /**
     * The text to use for the floating label.
     */
    label?: string;
    /**
     * Placeholder for the input.
     */
    placeholder?: string;
    /**
     * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
     */
    onChangeText?: (text: string) => void;
    /**
     * Underline color of the input.
     */
    underlineColor?: string;
    /**
     * Whether the input can have multiple lines.
     */
    multiline?: boolean;
    /**
     * The number of lines to show in the input (Android only).
     */
    numberOfLines?: number;
    /**
     * Callback that is called when the text input is focused.
     */
    onFocus?: () => void;
    /**
     * Callback that is called when the text input is blurred.
     */
    onBlur?: () => void;
    /**
     * Value of the text input.
     */
    value?: string;
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export interface ITextInputState {
    focused: Animated.Value;
    placeholder?: string;
}
export class TextInput extends React.Component<ITextInputProps, ITextInputState> {}

export interface ICaptionProps {
    style?: any;
}
export var Caption = (props: ICaptionProps) => React.ReactNode

export interface IHeadlineProps {
    style?: any;
}
export var Headline = (props: IHeadlineProps) => React.ReactNode

export interface IParagraphProps {
    style?: any;
}
export var Paragraph = (props: IParagraphProps) => React.ReactNode

export interface ISubheadingProps {
    style?: any;
}
export var Subheading = (props: ISubheadingProps) => React.ReactNode

export interface ITitleProps {
    style?: any;
}
export var Title = (props: ITitleProps) => React.ReactNode

export interface ITextState {
    style?: any;
    /**
     * @optional
     */
    theme?: Theme;
}
export class Text extends React.Component<ITextProps> {}
