class message {
    // Error
    static PROVIDE_INPUT = 'Please provide #';
    static INVALID_INPUT = 'Invalid #';
    static PASSWORD_REGEX = 'Password should contain 1 numeric, 1 special character, 1 alphabet';
    static MINIMUM = 'Must have at least # characters';
    static EMAIL_ALREADY_PRESENT = 'Email already in use. Please try other email or login';
    static CATEGORY_ALREADY_PRESENT = 'Category already present';
    static ITEM_ALREADY_PRESENT = 'Item already present';
    static MOBILE_ALREADY_PRESENT = 'Mobile number already in use. Please try other mobile number';
    static NO_CATEGORY = 'No category found';
    static NO_MENU = 'No menu found';
    static UNAUTHORIZED_ACTION = 'Not allowed to do this action';
    
    // Success
    static USER_CREATED = 'User created';
    static CATEGORY_CREATED = 'Category created';
    static ITEM_CREATED = 'Item created';
    static LOGIN = 'Login successfully';
    static LIST = '#';
    static REFRESH_TOKEN = 'Refresh token'
}
export default message