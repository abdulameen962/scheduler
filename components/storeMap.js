const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    successMessage: state.user.successMessage || null,
})

export default mapStateToProps