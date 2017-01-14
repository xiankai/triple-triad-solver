export const isBrowser = () => typeof window !== 'undefined';

/* eslint-disable */
export const getParameterByName = (name, url) => {
    if (!isBrowser()) {
      return;
    }

    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* eslint-enable */

export const isMobile = () =>
typeof window !== 'undefined' &&
/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
