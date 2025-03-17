let eventBus = new Vue();


// Компонент для отображения вкладок с информацией о продукте
Vue.component('product-tabs', {
    props: {
        reviews: { // Пропс для отзывов о продукте
            type: Array,
            required: false
        },
        shippingCost: { // Пропс для стоимости доставки
            type: String,
            required: true
        },
        details: { // Пропс для деталей продукта
            type: Array,
            required: true
        }
    },
    template: `
            <div>   
                <ul>
                    <span class="tab"
                          :class="{ activeTab: selectedTab === tab }" // Применяем класс activeTab к выбранной вкладке
                          v-for="(tab, index) in tabs" // Перебираем массив вкладок
                          @click="selectedTab = tab" // Устанавливаем выбранную вкладку при клике
                    >{{ tab }}</span>
                </ul>
                <div v-show="selectedTab === 'Reviews'"> // Показываем отзывы, если выбрана вкладка "Reviews"
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews" :key="review.name"> // Перебираем отзывы
                            <p>{{ review.name }}</p>
                            <p>Rating: {{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                            <p>Recommended: {{ review.recommendation }}</p>
                        </li>
                    </ul>
                </div>
                <div v-show="selectedTab === 'Make a Review'"> // Показываем форму отзыва, если выбрана вкладка "Make a Review"
                    <product-review></product-review>
                </div>
                <div v-show="selectedTab === 'Shipping'"> // Показываем стоимость доставки, если выбрана вкладка "Shipping"
                    <p>Shipping Cost: {{ shippingCost }}</p>
                </div>
                <div v-show="selectedTab === 'Details'"> // Показываем детали продукта, если выбрана вкладка "Details"
                    <h2>Details:</h2>
                    <ul>
                        <li v-for="detail in details" :key="detail">{{ detail }}</li>
                    </ul>
                </div>
            </div>
            `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'], // Названия вкладок
            selectedTab: 'Reviews' // Вкладка по умолчанию
        }
    }
});

// Компонент для формы отзыва о продукте
Vue.component('product-review', {
    template: `
            <form class="review-form" @submit.prevent="onSubmit"> // Предотвращаем стандартное поведение формы
                <p v-if="errors.length"> // Показываем ошибки, если они есть
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </p>
                <p>
                    <label for="name">Name:</label>
                    <input id="name" v-model="name" placeholder="name"> // Двусторонняя привязка к полю имени
                </p>
                <p>
                    <label for="review">Review:</label>
                    <textarea id="review" v-model="review"></textarea> // Двусторонняя привязка к полю отзыва
                </p>
                <p>
                    <label for="rating">Rating:</label>
                    <select id="rating" v-model.number="rating"> // Двусторонняя привязка к полю рейтинга
                        <option disabled value="">Please select one</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </p>
                <p>
                    <label>Would you recommend this product?</label>
                    <label>
                        <input type="radio" value="yes" v-model="recommendation"> Yes // Двусторонняя привязка к полю рекомендации
                    </label>
                    <label>
                        <input type="radio" value="no" v-model="recommendation"> No
                    </label>
                </p>
                <p>
                    <input type="submit" value="Submit"> // Кнопка отправки формы
                </p>
            </form>
            `,
    data() {
        return {
            name: '', // Имя пользователя
            review: '', // Текст отзыва
            rating: null, // Рейтинг
            recommendation: '', // Рекомендация
            errors: [] // Ошибки валидации
        }
    },
    methods: {
        onSubmit() {
            this.errors = []; // Сбрасываем ошибки
            // Проверяем, заполнены ли все поля
            if (this.name && this.review && this.rating && this.recommendation) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                };
                // Отправляем отзыв через event bus
                eventBus.$emit('review-submitted', productReview);
                this.resetForm(); // Сбрасываем форму
            } else {
                // Добавляем ошибки валидации
                this.errors.push(...[
                    !this.name && "Name required.",
                    !this.review && "Review required.",
                    !this.rating && "Rating required.",
                    !this.recommendation && "Recommendation required."
                ].filter(Boolean)); // Фильтруем пустые значения
            }
        },
        resetForm() {
            // Сбрасываем поля формы
            this.name = '';
            this.review = '';
            this.rating = null;
            this.recommendation = '';
        }
    }
});

// Компонент для отображения деталей продукта
Vue.component('product-details', {
    props: {
        details: {
            type : Array,
            required: true
        }
    },
    template: `
            <div>
                <h2>Details:</h2>
                <ul>
                    <li v-for="detail in details" :key="detail">{{ detail }}</li> // Перебираем детали продукта
                </ul>
            </div>
            `
});

// Основной компонент продукта
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
            <div class="product">
                <div class="product-image">
                    <img :src="image" :alt="altText"/> // Динамическое изображение продукта
                </div>
                <div class="product-info">
                    <h1>{{ title }}</h1> // Название продукта
                    <p>{{ description }}</p> // Описание продукта
                    <a :href="link">More products like this</a> // Ссылка на другие продукты
                    <p v-if="inStock">In stock</p> // Проверка наличия товара
                    <p v-else style="text-decoration: line-through">Out of Stock</p>
                    <span v-if="onSale"> On Sale </span <br><br> // Статус распродажи
                    <p>{{ sale }}</p> // Сообщение о распродаже
                    <div
                        class="color-box"
                        v-for="(variant, index) in variants" // Перебираем варианты продукта
                        :key="variant.variantId"
                        :style="{ backgroundColor: variant.variantColor }" // Динамический цвет варианта
                        @mouseover="updateProduct(index)" // Обновляем выбранный вариант при наведении
                    ></div>
                    <h2>Available Sizes:</h2>
                    <ul>
                        <li v-for="size in sizes" :key="size">{{ size }}</li> // Перебираем доступные размеры
                    </ul>
                    <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button> // Кнопка добавления в корзину
                    <button @click="removeFromCart">Remove from cart</button> // Кнопка удаления из корзины
                </div>
                <div>
                    <product-tabs :reviews="reviews" :shipping-cost="shipping" :details="details"></product-tabs> // Вкладки с информацией о продукте
                </div>
            </div>
            `,
    data() {
        return {
            reviews: [], // Массив для хранения отзывов
            product: "Socks", // Название продукта
            brand: 'Vue Mastery', // Бренд продукта
            description: "A pair of warm, fuzzy socks", // Описание продукта
            altText: "A pair of socks", // Альтернативный текст для изображения
            inventory: 100, // Общее количество товара на складе
            selectedVariant: 0, // Выбранный вариант продукта
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks', // Ссылка на другие продукты
            onSale: true, // Статус распродажи
            details: ['80% cotton', '20% polyester', 'Gender-neutral'], // Детали продукта
            variants: [ // Варианты продукта
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
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // Доступные размеры
            cart: [] // Корзина для хранения добавленных товаров
        }
    },
    methods: {
        addToCart() {
            // Добавляем товар в корзину
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            // Удаляем товар из корзины
            this.$emit('remove-from-cart');
        },
        updateProduct(index) {
            // Обновляем выбранный вариант продукта
            this.selectedVariant = index;
        },
        addReview(productReview) {
            // Добавляем отзыв о продукте
            this.reviews.push(productReview);
        }
    },
    mounted() {
        // Подписываемся на событие 'review-submitted' для добавления отзыва
        eventBus.$on('review-submitted ', this.addReview);
    },
    beforeDestroy() {
        // Отписываемся от события перед уничтожением компонента
        eventBus.$off('review-submitted', this.addReview);
    },
    computed: {
        title() {
            // Возвращаем полное название продукта
            return this.brand + ' ' + this.product;
        },
        image() {
            // Возвращаем изображение выбранного варианта
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            // Проверяем, есть ли товар в наличии
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale() {
            // Возвращаем статус распродажи
            return this.onSale ? `${this.brand} ${this.product} is on sale!` : `${this.brand} ${this.product} is not on sale.`;
        },
        shipping() {
            // Возвращаем стоимость доставки в зависимости от статуса премиум-клиента
            return this.premium ? "Free" : "2.99";
        }
    }
});

// Основной экземпляр Vue приложения
let app = new Vue({
    el: '#app', // Привязываем приложение к элементу с id 'app'
    data: {
        premium: true, // Статус премиум-клиента
        cart: [] // Корзина для хранения добавленных товаров
    },
    methods: {
        updateCart(id) {
            // Добавляем товар в корзину
            this.cart.push(id);
        },
        updateRemoveFromCart() {
            // Удаляем последний добавленный товар из корзины
            if (this.cart.length > 0) {
                this.cart.pop();
            }
        }
    }
});