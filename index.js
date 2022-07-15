//DOM

const listContainer = document.querySelector("#dog-list");
const segundaColumna = document.querySelector(".segunda-columna");
const search = document.querySelector("#search");
const errorMessage = document.querySelector(".error");

const domain = "https://dog.ceo/api";

const getData = async (uri) => {
  try {
    const url = `${domain}/${uri}`;
    const json = await fetch(url);
    const data = await json.json();
    return data.message;
  } catch (e) {
    console.log(e);
    errorMessage.classList.toggle("hidden");
    errorMessage.innerHTML = e;
  }
};

const renderImageList = async (entries) => {
  let list = ``;

  for (const [breed, breedArr] of entries) {
    const imagesData = await getData(`breed/${breed}/images`);
    const images = imagesData.slice(0, 3);
    //console.log(images)
    list += `
        <div class='${breed} breed'  >
            <h3>${breed}</h3>
            <div>
                <img src=${images[0]} width="100" height="100" class="img-click" loading="lazy">
                <img src=${images[1]} width="100" height="100" class="img-click" loading="lazy">
                <img src=${images[2]} width="100" height="100" class="img-click" loading="lazy">
            </div>
        </div>
    `;
  }
  return list;
};

const setupGallery = (images) => {
  const eventFunction = (image) => {
    image.removeEventListener("click", eventFunction);
    segundaColumna.appendChild(image);
  };
  images.forEach((image) => {
    image.addEventListener("click", () => {
      eventFunction(image);
    });
  });
};

const setupSearch = () => {
  search.addEventListener("keyup", (e) => {
    //Puede que necesitemos buscar todos los divs con un classname comun
    let filter = search.value.toLowerCase();
    let elements = document.querySelectorAll("div.breed");
    elements.forEach(elem=>{
      let value = elem.classList[0]
      console.log(value)
      if (value.toLowerCase().indexOf(filter) > -1) {
        elem.style.display = "block";
      } else {
        elem.style.display = "none";
      }
    })
  });
};

const runApp = async () => {
  const breedData = await getData("breeds/list/all");
  const entries = Object.entries(breedData);
  listContainer.innerHTML = await renderImageList(entries);
  const images = listContainer.querySelectorAll(".img-click");
  setupGallery(images);
  setupSearch();
};

runApp();
