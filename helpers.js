var carIcon = L.icon({
  iconUrl: "car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "visit.png",
  iconSize: [50, 60],
});

export const detecIcon = (type) => {
  switch (type) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
  }
};

//gönderilen veriye göre local storage güncellendi
export const setStorage = (data) => {
  //veriyi local storage göndermek için stringe çevirdik
  const strData = JSON.stringify(data);
  // local storage güncellendi
  localStorage.setItem("notes", strData);
};
