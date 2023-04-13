let reactiveData = new WeakMap;
let reactiveComponent = new Map;
let currentComponent = null;

function applyAndRegister(componentFunction) {
    currentComponent = componentFunction;
    componentFunction();
    currentComponent = null;
}

function registerReactiveData(component, prop) {
    if (reactiveData.get(component).get(prop) === undefined) reactiveData.get(component).set(prop, new Set);
    reactiveData.get(component).get(prop).add(currentComponent);
}

function notifyReactiveDataChanges(component, prop) {
    if (reactiveData.get(component).get(prop) === undefined) return;
    for (let reactiveComponentFunction of reactiveData.get(component).get(prop)) {
        reactiveComponentFunction();
    }
}

function reactive(componentData, componentName) {
    reactiveData.set(componentData, new Map);
    const reactiveProxyHandler = {
        get(target, prop, receiver) {
            if (currentComponent !== null) registerReactiveData(target, prop);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            const result = Reflect.set(target, prop, value, receiver);
            notifyReactiveDataChanges(target, prop);
            return result;
        }
    };
    reactiveComponent.set(componentName, new Proxy(componentData, reactiveProxyHandler));
    return reactiveComponent.get(componentName);
}

function startReactiveDom(element = document) {
    for (let inputElement of element.querySelectorAll("input.reactiveInput")) {
        const [componentName, propName] = inputElement.dataset.inputvar.split(".");
        inputElement.addEventListener("change", event => {
            reactiveComponent.get(componentName)[propName] = event.target.value;
        });
    }
    for (let clickableElement of element.querySelectorAll("[data-onclick]")) {
        const [componentName, methodName, methodArg] = clickableElement.dataset.onclick.split(/[.()]+/);
        clickableElement.addEventListener("click", event => {
            reactiveComponent.get(componentName)[methodName](methodArg);
        });
    }
    for (let textElement of element.querySelectorAll("[data-textvar]")) {
        const [componentName, propName] = textElement.dataset.textvar.split(".");
        applyAndRegister(() => {
            textElement.textContent = reactiveComponent.get(componentName)[propName];
        });
    }
    for (let textFunctionElement of element.querySelectorAll("[data-textfun]")) {
        const [componentName, methodName, methodArg] = textFunctionElement.dataset.textfun.split(/[.()]+/);
        applyAndRegister(() => {
            textFunctionElement.textContent = reactiveComponent.get(componentName)[methodName](methodArg);
        });
    }
    for (let styleFunctionElement of element.querySelectorAll("[data-stylefun]")) {
        const [componentName, methodName, methodArg] = styleFunctionElement.dataset.stylefun.split(/[.()]+/);
        applyAndRegister(() => {
            Object.assign(styleFunctionElement.style, reactiveComponent.get(componentName)[methodName](methodArg));
        });
    }
    const htmlVarElements = element.querySelectorAll("[data-htmlvar]");
    const htmlFunElements = element.querySelectorAll("[data-htmlfun]");
    for (let htmlVarElement of htmlVarElements) {
        const [componentName, propName] = htmlVarElement.dataset.htmlvar.split(".");
        applyAndRegister(() => {
            htmlVarElement.innerHTML = reactiveComponent.get(componentName)[propName];
            startReactiveDom(htmlVarElement);
        });
    }
    for (let htmlFunElement of htmlFunElements) {
        const [componentName, methodName, methodArg] = htmlFunElement.dataset.htmlfun.split(/[.()]+/);
        applyAndRegister(() => {
            htmlFunElement.innerHTML = reactiveComponent.get(componentName)[methodName](methodArg);
            startReactiveDom(htmlFunElement);
        });
    }
}

// Exporting the public functions
export {
    applyAndRegister,
    reactive,
    startReactiveDom,
};