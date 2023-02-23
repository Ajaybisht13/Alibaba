import Header from '../../Header/Header'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
    data: state.cardItem
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(Header)