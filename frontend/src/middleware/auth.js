export default function auth ({ next, store }){
    if(!store.state.authentication.status.loggedIn){
        return next('/login')
    }
    return next()
   }