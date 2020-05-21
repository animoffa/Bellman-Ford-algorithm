import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dots: [{
                a: 200,
                b: 300,
                id: 1,
            }],
            n: 1,
            a: 200,
            b: 300,
            lines: [],
            parents: [],
            distances: [],
            shortWay: 0,
            activeDots: [],
            time: 0
        }
    }

    draw(event) {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var x = event.clientX;
            var y = event.clientY;
            let per = 0;
            ctx.beginPath();

            function getRandomIntInclusive() {
                let min = Math.ceil(1);
                let max = Math.floor(100);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let clickDraw = (weight) => {
                let xmiddle = (this.state.a + x) / 2;
                let ymiddle = (this.state.b + y) / 2;
                ctx.font = "18px serif";
                ctx.fillStyle = "#FFF";
                ctx.fillText(weight, (xmiddle + x) / 2 + 12, (ymiddle + y) / 2 + 12);
                ctx.arc(this.state.a, this.state.b, 11, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "#000";
                let N = String(this.state.n);
                ctx.fillText(N, this.state.a - 6, this.state.b + 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(((xmiddle + x) / 2 + x) / 2, ((ymiddle + y) / 2 + y) / 2, 4, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.stroke();
            };
            this.state.dots.forEach(d => {
                if (x >= d.a - 18 && x <= d.a + 18 && y >= d.b - 18 && y <= d.b + 18) {

                    ctx.lineTo(d.a, d.b);
                    let weight = prompt("Введите вес ребра", getRandomIntInclusive());
                    if (weight === null) {
                        weight = 0;
                    }
                    clickDraw(weight);
                    per = 1;
                    this.setState((state) => {
                        return {
                            ...state,
                            lines: [...state.lines, {
                                startDots: {a: state.a, b: state.b, id: state.n},
                                weight: weight,
                                endDots: {x: d.a, y: d.b, id: d.id}
                            }],
                        }
                    })
                }
            });
            if (per === 0) {
                ctx.lineTo(x, y);
                let weight = prompt("Введите вес ребра", getRandomIntInclusive());
                if (weight === null) {
                    weight = 0;
                }
                clickDraw(weight);
                this.setState((state) => {
                    return {
                        ...state,
                        a: x,
                        b: y,
                        dots: [...state.dots, {a: x, b: y, id: state.n + 1}],
                        lines: [...state.lines, {
                            startDots: {a: state.a, b: state.b, id: state.n},
                            weight: weight,
                            endDots: {x: x, y: y, id: state.n + 1}
                        }],

                        n: state.n + 1,
                    }
                })
            }
        }
    }

    bellmanFord() {
        const start = performance.now();
        var canvas = document.getElementById('canvas');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = "#7aff60";
            ctx.arc(200, 300, 11, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillText("1", 194, 305);
            let lenght = this.state.dots.length;
            let xx = this.state.dots[lenght - 1].a;
            let yy = this.state.dots[lenght - 1].b;
            ctx.fillStyle = "#ff0004";
            ctx.arc(xx, yy, 11, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.fillStyle = "#000000";
            let N = String(this.state.dots[lenght - 1].id);
            ctx.fillText(N, xx - 6, yy + 5);
            ctx.stroke();
        }
        let distances = {};
        let parents = {};
        let shortWay = 0;
        let c;
        let activeDots = [];


        for (let i = 0; i < this.state.dots.length; i++) {
            distances[this.state.lines[i].endDots.id] = Infinity;
            parents[this.state.lines[i].endDots.id] = null;
        }
        distances[1] = 0;
        for (let i = 0; i < this.state.dots.length - 1; i++) {
            for (let j = 0; j < this.state.lines.length; j++) {
                c = this.state.lines[j];
                if (distances[c.startDots.id] + c.weight < distances[c.endDots.id]) {
                    distances[c.endDots.id] = distances[c.startDots.id] + c.weight;
                    parents[c.endDots.id] = c.startDots.id;
                    shortWay = shortWay + Number(c.weight);
                    activeDots = [...activeDots, c.endDots.id]
                }
            }
        }
        for (let i = 0; i < this.state.lines.length; i++) {
            c = this.state.lines[i];
            if (distances[c.startDots.id] + c.weight < distances[c.endDots.id]) {
                return undefined;
            }
        }

        const time = performance.now() - start;
        this.setState((state) => {
            return {
                ...state,
                shortWay: shortWay,
                activeDots: activeDots,
                time: time
            }
        });
        return {parents, distances, shortWay};
    }

    render() {

        return (
            <div className={"main"}>
                <canvas id="canvas" width={"1200px"} height={"800px"} onClick={(event) => this.draw(event)}>в</canvas>
                <span className={"Results"}>
                    Вес минимального пути: {this.state.shortWay}<br/>
                    Минимальный путь: <span><span className={"dots"}>1</span>{this.state.activeDots.map(d => <span
                    className={"dots"}>{d}</span>)}</span><br/>
                Время выполнения: {this.state.time} ms
                </span>
                <button className={"BellmanFordButton"} onClick={() => this.bellmanFord()}>старт</button>
                <div className={"Description"}><b style={{margin: "15px"}}>Данная программа реализует алгоритм
                    Беллмана-Форда</b><br/>
                    Для того, что бы начать рисовать график, нажмите на поле. Для соединения точки с уже существующей
                    просто нажмите на неё. Приносим свои извинения, в данный момент сайт не адаптирован для мобильных
                    устройств. Пожалуйста , соединяйте первую и последнюю точку во избежание ошибок.
                </div>
            </div>

        );
    }
}


export default App;
