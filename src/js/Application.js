import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._counter = 0;
    this._loading = HTMLProgressElement;
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  async _load(){
    document.getElementsByClassName("progress")[0].style.display = "block";
    let url = this._counter === 0 ?"https://swapi.boom.dev/api/planets":
        "https://swapi.boom.dev/api/planets?page="+this._counter;

    const data = await fetch(url)
        .then((response) => response.json());


    if (data.next != null) {
      this._create(data.results);

      this._counter++;
      await this._load();
    }

    return data.results;
  }

  _create(planets){

    let main = document.getElementsByClassName("main")[0];

    console.log(planets)
    for (let planet of planets) {
      main.innerHTML += this._render({name: planet.name, terrain: planet.terrain,
        population: planet.population});
    }
    this._stopLoading()
  }

  async _startLoading(){

    let data = await this._load();
    this._create(data);
  }

  _stopLoading(){
    document.getElementsByClassName("progress")[0].style.display = "none";
  }
}
