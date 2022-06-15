export const templateProduct = (imgUrl, imgProfileUrl, title, author, price) => {
    return `<div class="card">
                <div class="img-product">
                    <img src="${imgUrl}" alt="">
                    <div class="bg-showMore">
                        <span>
                            <i class="fa-solid fa-cash-register"></i>
                            Comprar
                        </span>
                    </div>
                </div>

                <div class="card-inf">
                    <img src="${imgProfileUrl}" class="img-profile" alt="">

                    <div class="description">
                        <span class="productName">${title}</span>
                        <span class="profileName"2>${author}</span>
                    </div>

                    <p class="price">
                        <i class="fa-solid fa-piggy-bank"></i>
                        <span>${price}</span>
                    </p>
                </div>
            </div>`;
}