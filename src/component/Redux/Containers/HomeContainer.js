import { connect } from 'react-redux';
import Home from '../../StackScreen/Home';
import { addToCart, removeToCart } from '../Services/Actions/action'

const mapStateToProps = state => ({
    //     data : state.cardItem
})

const mapDispatchToProps = dispatch => ({
    addToCartHandler: data => dispatch(addToCart(data)),
    removeToCartHandler: data => dispatch(removeToCart(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(Home)


// export default Home;