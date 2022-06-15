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


//Template for Modal about add product
export const templateModalAddProducts = `
    <div class="form">
        <div div style="display: grid;  grid-template-columns: 1fr 1fr; gap:1em;">
            <div>
                <div class="label">
                    <i class="fa-solid fa-tag"></i>
                    <label for="inp-nameProduct">Ingrese el nombre del producto</label>
                </div>
                <input type="text" id="inp-productName" placeholder="Tasa de doña Juana">

                <div class="label">
                    <i class="fa-solid fa-piggy-bank"></i>
                    <label for="inp-productPrice">Ingrese el precio del articulo</label>
                </div>
                <input type="number" id="inp-productPrice" placeholder="000">
            </div>

            <div>
                <div id="upload-img" upload-img class="input-image" style="width:100%; height:100%">
                    <div> <span> Subir imágen </span> </div>
                    <input type="file" id="inp-img" accept="image/*" style="display:none">
                </div>
            </div>
        </div>
    </div>
`;