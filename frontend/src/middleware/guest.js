export default function guest ({ next, store }){
    if(store.state.authentication.status.loggedIn){
        return next('dashboard')
    }
   
    return next()
   }