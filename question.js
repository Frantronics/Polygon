
/*
    Take a polygon defined by the points 'points', use the mouse
    events to draw a line that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the line you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that line (mouseUp.png)
*/

// store the line in variable line
var line = {};

//create and append a new line on the pre-exsisting svg
function intializeLine() {
    var svg = document.getElementsByTagName('svg')[0];
    svgLine.setAttribute('stroke', 'black');
    svgLine.setAttribute('x1', line.x1);
    svgLine.setAttribute('y1', line.y1);
    svg.appendChild(svgLine);
}

// create a line element
var svgLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');

function onMouseDown(event) {
    //Add code here
    line.x1 = event.offsetX;
    line.y1 = event.offsetY;

    intializeLine();
}

function onMouseMove(event) {
    //Add code here
    line.x2 = event.offsetX;
    line.y2 = event.offsetY;
    svgLine.setAttribute('x2', line.x2);
    svgLine.setAttribute('y2', line.y2);
}

function onMouseUp(event) {
    const poly1 = [];
    const poly2 = [];

    //Generate the two sets of points for the split polygons
    //An algorithm for finding interceptions of two lines can be found in https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    
    // we create polygon as a copy of points but we append the first point to it in order to also check against the last polygon segment
    const polygon = [...points, points[0]];

    // flags to check when an intersection has been
    var isIntersection1 = false;
    var isIntersection2 = false;


    polygon.forEach(function (point, i, points) {
        if (i < points.length - 1) {

            let inter = checkIntersection(line, point, points[i + 1]);

            if (inter && !isIntersection1) {
                poly1.push(point, inter);
                poly2.push(inter);
                isIntersection1 = true;
            } else if (inter && isIntersection1 && !isIntersection2) {
                poly2.push(point, inter);
                poly1.push(inter);
                isIntersection2 = true;
            } else if (!inter && isIntersection1 && !isIntersection2) {
                poly2.push(point);
            } else {
                poly1.push(point);
            }
        }
    });

    clearPoly();


    //check if there's any intersection, if not return the inital polygon
    if (!isIntersection1 || !isIntersection2) {
        addPoly(points, 'black');
    } else {
        addPoly(poly1, 'blue');
        addPoly(poly2, 'green');
    }

    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
}

// function to check for intersection
function checkIntersection(line, polygonPoint, polygonNextPoint) {
    var point1 = { x: line.x1, y: line.y1 };
    var point2 = { x: line.x2, y: line.y2 };
    var point3 = { x: polygonPoint.x, y: polygonPoint.y };
    var point4 = { x: polygonNextPoint.x, y: polygonNextPoint.y };


    var deltaValue0 = (point4.y - point3.y) * (point2.x - point1.x) - (point4.x - point3.x) * (point2.y - point1.y);

    // if delta0 is 0 then the 2 segments are parallel, so interesction can occour
    if (deltaValue0 === 0) {
        return false;
    }

    var deltaValue1 = (point4.x - point3.x) * (point1.y - point3.y) - (point4.y - point3.y) * (point1.x - point3.x);

    var deltaValue2 = (point2.x - point1.x) * (point1.y - point3.y) - (point2.y - point1.y) * (point1.x - point3.x);

    var varDeltaA = deltaValue1 / deltaValue0;
    var varDeltaB = deltaValue2 / deltaValue0;

    if ((varDeltaA >= 0 && varDeltaA <= 1) && (varDeltaB >= 0 && varDeltaB <= 1)) {
        var intersectionX = point1.x + varDeltaA * (point2.x - point1.x);
        var intersectionY = point1.y + varDeltaA * (point2.y - point1.y);

        return { x: intersectionX, y: intersectionY };
    }

    return false;
}

/*
    Code below this line shouldn't need to be changed
*/

//Draw a polygon from the given points and set a stroke with the specified color
function addPoly(points, color = 'black') {
    if (points.length < 2) {
        console.error("Not enough points");
        return;
    }

    const content = document.getElementById('content');

    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y

    for (const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);

    svgElement.setAttribute('height', "500");
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');

    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x: 100, y: 100 },
    { x: 200, y: 50 },
    { x: 300, y: 50 },
    { x: 400, y: 200 },
    { x: 350, y: 250 },
    { x: 200, y: 300 },
    { x: 150, y: 300 },
]

window.onload = () => setup()