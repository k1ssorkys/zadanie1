Vue.component('product', {
    template: `
   <div class="product">
            <div class="product-image">
              <img alt="#" :src="image" :alt="altText"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{description}}</p>
                <a href="https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks">{{link}}</a>
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ line: !inStock }" >Out of Stock</p>
                <span v-if="onSale">On Sale</span>
                <div
                     class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor:variant.variantColor }"
                     @mouseover="updateProduct(index)">



                </div>
                <li v-for="size in sizes">{{size}}</li>
                <div class="cart">
                    <p>Cart({{ cart }})</p>
                    <button v-on:click="addToCart"  :class="{ disabledButton: !inStock }">Add to cart</button>
                    <button v-on:click="ubratOnCart">Ubrat from cart</button>
                </div>
                <span>{{ sale }}</span>
            </div>
        </div>`
    ,
    data() {
        return {
            // тут будут данные
        }
    },
    methods: {
        // тут будут методы
    },
    computed: {
        // тут будут вычисляемые свойства
    }


})
let app = new Vue({

    el: '#app',
    data: {

        product: "Socks",
        brand: 'Vue Mastery',
        description: "A pair of warm, fuzzy socks",
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "More products like this",
        onSale: true,
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;

        },

        ubratOnCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            } else {
                alert("Бро, корзина и так пуста куда минусуешь");
            }
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} is on sale!` : `${this.brand} ${this.product} is not on sale.`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },

    },

})