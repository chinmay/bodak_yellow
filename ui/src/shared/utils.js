const TRILLION = 1000000000000;
const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;

const EXOTIC_SYMBOLS = {
  BTC: "\u20BF"
};

export const NOT_FOUND = 404;
export const SERVER_ERROR = 500;
export const BAD_REQUEST = 400;

export const DECIMAL_REGEX = /^\d+$/;
export const HASH_REGEX = /[0-9A-F]{64}/i;

export const UP_COLOR = "#2BCB96";
export const DOWN_COLOR = "#F23548";
export const LINE_COLOR = "#0F72E5";
export const BLACK_20 = "#E1E4E8";
export const BLACK_30 = "#C9CDD1";
export const BLACK_40 = "#B1B5BA";
export const WHITE = "#FFFFFF";

export const BREAKPOINTS = {
  desktop: 1200,
  landscape: 900,
  portrait: 600,
  phone: 375
};

export const ANALYTIC_TYPES = {
  pageview: "pageview",
  event: "event",
  social: "social",
  timing: "timing",
  exception: "exception"
};

const EXCHANGE_NAMES = {
  hitbtc: "HitBTC",
  "xrp-ledger": "XRP Ledger",
  btcmarkets: "BTC Markets",
  zb: "ZB.com",
  "cex.io": "CEX.io",
  "bitcoin-indonesia": "Indodax"
};

const NUMBER_DEFAULT_OPTIONS = {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
  useGrouping: true
};

export const getExchangeName = source =>
  EXCHANGE_NAMES[source] || source.replace(/^\w/, char => char.toUpperCase());

const RANGES = {
  "24.hour": {
    label: "24H",
    intervals: {
      wide: "5.minute",
      narrow: "15.minute"
    }
  },
  "7.day": {
    label: "7D",
    intervals: {
      wide: "1.hour",
      narrow: "2.hour"
    }
  },
  "30.day": {
    label: "30D",
    intervals: {
      wide: "4.hour",
      narrow: "1.day"
    }
  }
};

export const RANGELIST = Object.keys(RANGES).map(key => ({
  value: key,
  label: RANGES[key].label
}));

export const getInterval = (key, width) => {
  const range = RANGES[key];
  return width > BREAKPOINTS.portrait
    ? range.intervals.wide
    : range.intervals.narrow;
};

export const normalizeLanguage = (lang = "en-US") => {
  let selectedLanguage;
  if (lang === "en" || lang === "en-US" || lang.indexOf("en-") === 0) {
    // Only US English supported now
    selectedLanguage = "en-US";
  } else if (
    lang === "zh" ||
    lang === "zh-Hans" ||
    lang === "zh-Hant" ||
    lang.indexOf("zh-") === 0
  ) {
    // Only Simplified chinese supported now
    selectedLanguage = "zh-Hans";
  } else if (lang === "ja" || lang === "ja-JP" || lang.indexOf("ja-") === 0) {
    // Japanese
    selectedLanguage = "ja-JP";
  } else if (
    lang === "ko" ||
    lang === "ko-KR" ||
    lang === "ko-KP" ||
    lang.indexOf("ko-") === 0
  ) {
    // Korean
    selectedLanguage = "ko-KP";
  } else {
    // Defualt to en-US
    selectedLanguage = "en-US";
  }
  return selectedLanguage;
};

export const formatPrice = (
  number,
  lang = "en-US",
  currency = "USD",
  decimals = 4
) =>
  localizeNumber(number.toPrecision(decimals), lang, {
    style: "currency",
    currency
  });

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const localizeNumber = (num, lang = "en-US", options = {}) => {
  const number = Number.parseFloat(num);
  const config = Object.assign({}, NUMBER_DEFAULT_OPTIONS, options);

  if (Number.isNaN(number)) {
    return null;
  } else if (config.style === "currency") {
    try {
      const d = new Intl.NumberFormat(lang, config).format(number);
      const index = d.search(/\d/);
      const symbol = d.slice(0, index).trim();
      const newSymbol = EXOTIC_SYMBOLS[symbol] || symbol;
      return `${newSymbol}${d.slice(index)}`;
    } catch (error) {
      config.style = "decimal";
      delete config.currency;
      return Intl.NumberFormat(lang, config).format(number);
    }
  }

  return new Intl.NumberFormat(lang, config).format(number);
};

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
export const localizeDate = (date, lang = "en-US", options = {}) => {
  // TODO: default config
  if (!date) {
    return null;
  }
  return new Intl.DateTimeFormat(lang, options).format(date);
};

export const getLocalizedCurrencySymbol = (
  lang = "en-US",
  currency = "USD"
) => {
  const options = {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency
  };

  const formatted = localizeNumber(1, lang, options);
  return formatted.split("1")[0].trim();
};

export const formatLargeNumber = (d = 0, digits = 4) => {
  if (d >= TRILLION) {
    return {
      num: (d / TRILLION).toFixed(digits),
      unit: "T"
    };
  }

  if (d >= BILLION) {
    return {
      num: (d / BILLION).toFixed(digits),
      unit: "B"
    };
  }

  if (d >= MILLION) {
    return {
      num: (d / MILLION).toFixed(digits),
      unit: "M"
    };
  }

  if (d >= THOUSAND) {
    return {
      num: (d / THOUSAND).toFixed(digits),
      unit: "K"
    };
  }

  return {
    num: d.toFixed(digits),
    unit: ""
  };
};

// Document: https://developers.google.com/analytics/devguides/collection/analyticsjs/
export const analytics = (type = null, fields = {}) => {
  // Chek if GoogleAnalytics is set, type and fields are not empty, type is valid
  if (
    !window.ga ||
    !type ||
    Object.keys(fields).length === 0 ||
    Object.keys(ANALYTIC_TYPES).indexOf(type) === -1
  ) {
    return false;
  }
  // Check for required fields for each type
  let flag = true;
  switch (type) {
    case "pageview":
      flag = !!fields.title;
      break;
    case "event":
      flag = !!fields.eventCategory && !!fields.eventAction;
      break;
    case "social":
      flag =
        !!fields.socialNetwork &&
        !!fields.socialAction &&
        !!fields.socialTarget;
      break;
    case "timing":
      flag =
        !!fields.timingCategory && !!fields.timingVar && !!fields.timingValue;
      break;
    case "exception":
      flag = !!fields.exDescription;
      break;
    default:
      flag = false;
  }

  if (flag) {
    window.ga("send", type, fields);
  }
  return flag;
};

export const poll = (fn, retries = 15, timeoutBetweenAttempts = 2000) => {
  let counter = retries;

  return Promise.resolve()
    .then(fn)
    .catch(function retry(err) {
      if ((counter -= 1 > 0))
        return setTimeout(
          () =>
            Promise.resolve()
              .then(fn)
              .catch(retry),
          timeoutBetweenAttempts
        );

      return Promise.resolve();
    });
};

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function validateState(payment, state, callback) {
  if (payment.state === state) {
    callback();
  } else {
    throw new Error("continue polling");
  }
}
