import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, setStorage } from "./helpers.js";

var map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
var layerGroup = [];

// harıtaya tıkladığımızda çalışır ve parametresine tıkladığımız yerle alakalı veriler gelir
const onMapClick = (e) => {
  // haritaya tıkladığımızda form alanının style özelliğini flex yap
  form.style.display = "flex";
  // coords dizisine tıkladığımız yerin koordinatlarını ekle
  coords = [e.latlng.lat, e.latlng.lng];
};

const loadMap = (e) => {
  //* Haritanın kurulumu
  map = L.map("map").setView([51.505, -0.09], 13);
  //* Haritanın nasıl gözükeceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  //haritada ekrana bascak olduğumuz imleçleri tutacak olan katman
  layerGroup = L.layerGroup().addTo(map);
  //localden gelen notes ları listeler
  renderNoteList(notes);

  // harıtada bir alana tıklanma olduğunda çalışacak fonksiyondur
  //fonksiyon eventına tıklanıldıında konum ile ilgili bilgiler gösterilir
  map.on("click", onMapClick);
};

navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullanıcı Kabul Etmedi!!!")
);

const renderMarker = (item) => {
  //   console.log(item);
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup)
    .bindPopup(`${item.desc}`);
};

const renderNoteList = (item) => {
  list.innerHTML = "";

  layerGroup.clearLayers();

  item.forEach((item) => {
    const listElement = document.createElement("li");
    //datasına sahip olduğu idyi ekleme
    listElement.dataset.id = item.id;
    listElement.innerHTML = `
         <div>
              <p>${item.desc}</p>
              <p><span>Tarih:</span>${item.date}</p>
              <p><span>Durum:</span>${item.status}</p>
            </div>
             <i id="delete" class="bi bi-x"></i>
            <i id="fly" class="bi bi-airplane-fill"></i>
        `;
    list.insertAdjacentElement("afterbegin", listElement);

    renderMarker(item);
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  //   console.log(e);
  // imputların ve selectin
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  // notes dizisine oluşturduğumuz yeni not objesini ekledik
  notes.push({ id: uuidv4(), desc, date, status, coords });
  //   console.log(notes);

  //local storage güncelleme
  setStorage(notes);

  renderNoteList(notes);

  form.style.display = "none";
};

const handleClick = (e) => {
  //güncellenecek elemanın idsini öğrenme
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    //idisini bildiğimiz elemanı diziden kaldırma
    notes = notes.filter((note) => note.id != id);
    setStorage(notes);
    renderNoteList(notes);
  }
  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
};

//! HTML den glenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay izleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);
