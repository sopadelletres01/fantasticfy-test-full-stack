//DOM

const listContainer = document.querySelector("#dog-list");
const segundaColumna = document.querySelector(".segunda-columna");
const search = document.querySelector("#search");
const sortA = document.querySelector("#sortA");
const sortD = document.querySelector("#sortD");
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

const setupSort = () => {
  //He decidido hacer el sort en orden alfabetico descendiente en vez de ascendente porque la api devuelve los resultados ordenados de primeras
  //De esta forma se puede apreciar que el sort funciona
  sortD.addEventListener("click",()=>{
    let elements = document.querySelectorAll("div.breed");
    let elems = Array.from(elements).sort((a,b)=>{
      let aValue = a.classList[0] 
      let bValue = b.classList[0] 
      //Orden descendiente
      if (aValue < bValue) {
        return 1;
      }
      if (aValue > bValue) {
        return -1;
      }
      return 0;
    })
    listContainer.innerHTML = ""
    elems.forEach(elem=>{
      listContainer.append(elem)
    })
  })
  sortA.addEventListener("click",()=>{
    let elements = document.querySelectorAll("div.breed");
    let elems = Array.from(elements).sort((a,b)=>{
      let aValue = a.classList[0] 
      let bValue = b.classList[0] 
      //Orden descendiente
      if (aValue > bValue) {
        return 1;
      }
      if (aValue < bValue) {
        return -1;
      }
      return 0;
    })
    listContainer.innerHTML = ""
    elems.forEach(elem=>{
      listContainer.append(elem)
    })
  })
}

const runApp = async () => {
  const breedData = await getData("breeds/list/all");
  const entries = Object.entries(breedData);
  listContainer.innerHTML = await renderImageList(entries);
  const images = listContainer.querySelectorAll(".img-click");
  setupGallery(images);
  setupSearch();
  setupSort()
};

runApp();
