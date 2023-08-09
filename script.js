const richestPeople = [
  "Elon Musk",
  "Bernard Arnault",
  "Jeff Bezos",
  "Bill Gates",
  "Larry Ellison",
  "Larry Page",
  "Warren Buffett",
  "Mark Zuckerberg",
  "Steve Ballmer",
  "Sergey Brin",
];

class Shuffle {
  constructor(array) {
    this.array = array;
  }

  shuffle() {
    let index = this.array.length - 1;
    let randomIndex;
    while (index >= 0) {
      randomIndex = Math.floor(Math.random() * (index + 1));
      [this.array[index], this.array[randomIndex]] = [this.array[randomIndex], this.array[index]]
      index--;
    }
    const updateDom = new UpdateDom(this.array);
    updateDom.updateDom();
  }

  //  shuffle() {
  //   let currentIndex = this.array.length;
  //   let randomIndex;
  //   while (currentIndex != 0) {
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;
  //     [this.array[currentIndex], this.array[randomIndex]] = [this.array[randomIndex], this.array[currentIndex]];
  //   }
  //   const updateDom = new UpdateDom(this.array);
  //   updateDom.updateDom();
  // }
}

class UpdateDom {
  constructor(array) {
    this.array = array;
    this.draggable_list = document.getElementById('draggable-list');
  }
  
  updateDom() {
    this.array.forEach((el, idx) => {
      const listEl = document.createElement('li');
      listEl.setAttribute('data-index', idx);
      listEl.innerHTML = `
      <span class="number">${idx + 1}</span>
      <div class="draggable" draggable="true">
      <p class="person-name">${el}</p>
      <i class="fas fa-grip-lines"></i>
      </div>
      `
      this.draggable_list.appendChild(listEl);
    });
    new Check();
    const events = new Events(this.array);
    events.events();
  }
}

class Events {
  constructor(array) {
    this.array = array; 
    this.draggableDivs = document.querySelectorAll('.draggable');
    this.draggableListItems = document.querySelectorAll('.draggable-list li');
    this.startIndex;
    this.endIndex;
  }

  events() {
    this.draggableDivs.forEach(div => {
      div.addEventListener('dragstart', this.dragStart.bind(this));
    });
    this.draggableListItems.forEach(item => {
      item.addEventListener('dragover', this.dragOver.bind(this));
      item.addEventListener('drop', this.drop.bind(this));
      item.addEventListener('dragenter', this.dragEnter.bind(this));
      item.addEventListener('dragleave', this.dragLeave.bind(this));
    });
  }

  dragStart(e) {
    this.startIndex = +e.currentTarget.closest('li').getAttribute('data-index');
  }
  dragOver(e) {
    e.preventDefault();
  }
  drop(e) {
    this.endIndex = +e.currentTarget.getAttribute('data-index');
    Swap.swap(this.startIndex, this.endIndex);
  }
  dragEnter(e) {
    e.currentTarget.classList.add('over');
  }
  dragLeave(e) {
    e.currentTarget.classList.remove('over');
  }
}

class Swap {
  static swap(start, end) {
    const listItems = document.querySelectorAll('.draggable-list li');
    const dragged = listItems[start].querySelector('.draggable')
    const dropped = listItems[end].querySelector('.draggable')
    listItems[end].appendChild(dragged);
    listItems[start].appendChild(dropped);
    listItems[end].classList.remove('over');
  }
}

class Check extends Events {
  constructor() {
    super();
    this.checkBtn = document.getElementById('check');
    this.checkBtn.addEventListener('click', this.checkList.bind(this));
    this.timeout;
  }

  checkList() {
    this.draggableListItems.forEach((el, idx) => {
      if (el.querySelector('p').textContent !== richestPeople[idx]) {
        el.classList.add('wrong');
      } else {
        el.classList.remove('wrong');
        el.classList.add('right');
      }
      clearTimeout(this.timeout);
    });
    this.removeClasses();
  }

  removeClasses() {
    this.timeout = setTimeout(() => {
      this.draggableListItems.forEach(el => {
        if (el.className.includes('right')) {
          el.classList.remove('right');
        } else if (el.className.includes('wrong')) {
          el.classList.remove('wrong');
        }
      });
    }, 3000);
  }
}

const shuffle = new Shuffle([...richestPeople]);
shuffle.shuffle();
