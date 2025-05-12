import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const formElem = document.querySelector('.form')

function createPromise(delay, state){
    return  new Promise((res, rej)=>{
        setTimeout(()=>{
            if (state === "fulfilled"){
                res(delay);
            } else {
                rej(delay);
            }
        }, delay )
    })
}

formElem.addEventListener('submit',  event =>{
    event.preventDefault()
    const delay = event.target.delay.value;
    const state = event.target.state.value;
    createPromise(delay, state).then((delay) =>{
        iziToast.success({
            title: 'Fulfilled',
            message: `✅ Fulfilled promise in ${delay}ms`,
            position: "topRight"
        })
    }).catch((delay)=>{
        iziToast.error({
            title: 'Rejected',
            message: `❌ Rejected promise in ${delay}ms`,
            position: "topRight"
        })
}).finally(() =>{
    formElem.reset();
})
})


