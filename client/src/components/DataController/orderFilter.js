const filterOrder=(type,orders)=>{
   let filteredOrder=[]
   if(type=="all"){
    filteredOrder=orders
   }
   if(type=="pending"){
    orders.forEach((order)=>{
        if(order.orderStatus=="pending"){
            filteredOrder.push(order)
        }
    })
   }
   if(type=="delivered"){
    orders.forEach((order)=>{
        if(order.orderStatus=="delivered"){
            filteredOrder.push(order)
        }
    })
   }
   if(type=="cancelled"){
    orders.forEach((order)=>{
       if(order.orderStatus=="cancelled"){
           filteredOrder.push(order)
       }
   })}
   return filteredOrder
}
export default filterOrder