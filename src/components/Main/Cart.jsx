import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { removeProduct, clearCart } from "../../store/slices/cartSlice";

export default function Cart() {
  const { cart } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const [total, setTotal] = useState(0);
  const [emptyCartMsg, setMsg] = useState({msg: "В корзине ничего нет",
  style: {margin: "100px"}})
  const [userData, setUserData] = useState({
    phone: '',
    address: '',
    agreement: false
  })

  useEffect(() => {
    let sum = 0;
    for (let item of cart) {
      sum += item.product.price * item.quantity;
      console.log(sum);
    }
    setTotal(sum);
  }, [cart]);

  function removeItem(id) {
    dispatch(removeProduct(id))
    console.log(cart);
  }

  function changeUserData(e) {
    (e.target.id !== 'agreement') 
    ? setUserData(prevState => ({...prevState, [e.target.id]: e.target.value}))
    : setUserData(prevState => ({...prevState, [e.target.id]: e.target.checked}))
    console.log(userData);
  }
  function checkout (e) {
    e.preventDefault();
    const items = [];
    for (let elem of cart) {
      const item = {
        id: elem.product.id,
        price: elem.product.price,
        count: elem.quantity
      }
      items.push(item);
    }
    const request = {
      owner: {
        phone: userData.phone,
        address: userData.address
      },
      items: items
    }
    console.log(JSON.stringify(request));
    fetch(process.env.REACT_APP_URL + "/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(request)
    }).then(o => {
      dispatch(clearCart());
      if (o) setMsg({
        msg:"Покупка успешно оформлена", 
        style: {
          margin: "100px",
          color:"green"
      }})
    })
  }

    return (<>
    {cart.length === 0 ? <h3 className="text-center" style={emptyCartMsg.style}>{emptyCartMsg.msg}</h3> :( <><section className="cart">
            <h2 className="text-center">Корзина</h2>
            <table className="table table-bordered">
         
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Название</th>
                  <th scope="col">Размер</th>
                  <th scope="col">Кол-во</th>
                  <th scope="col">Стоимость</th>
                  <th scope="col">Итого</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
              {cart.map((item, index) => (
                <tr key={item.product.id}>
                  <td scope="row">{index + 1}</td>
                  <td><Link to={`/products/${item.product.id}`}>{item.product.title}</Link></td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>{item.product.price} руб.</td>
                  <td>{item.product.price * item.quantity} руб.</td>
                  <td><button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(item.product.id)}>Удалить</button></td>
                </tr>))}
                <tr>
                  <td colSpan="5" className="text-right">Общая стоимость</td>
                  <td>{total} руб.</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="order">
            <h2 className="text-center">Оформить заказ</h2>
            <div className="card" style={{maxWidth: '30rem', margin: '0 auto'}}>
              <form className="card-body"onSubmit={checkout}>
                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input className="form-control" id="phone" placeholder="Ваш телефон" onChange={changeUserData}/>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Адрес доставки</label>
                  <input className="form-control" id="address" placeholder="Адрес доставки" onChange={changeUserData}/>
                </div>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="agreement" onChange={changeUserData}/>
                  <label className="form-check-label" htmlFor="agreement">Согласен с правилами доставки</label>
                </div>
                {(userData.agreement) ? <button type="submit" className="btn btn-outline-secondary">Оформить</button> :
                <button type="submit" className="btn btn-outline-secondary" disabled>Оформить</button>}
              </form>
            </div>
          </section></>)}
          </>
    )
}