console.log("JS Loaded");

const onSubmitHandler = (e) =>{
e.preventDefault();
// console.log("Form submitted");
const product = e.target.productName.value;

const obj = {
    "productName": product,
};

// axios.post('http://localhost:3000' + "/products" , obj).then((result) => {
//     console.log(result.data);
// })

axios.post("http://localhost:3000/products", obj)
.then((result) => {
    console.log(result.data);
})
.catch((err) => {
    console.log(err);
});
}