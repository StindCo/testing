function subscribe(eventName: any, listener: any) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: any, listener: any) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: any, data: any) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
