import {
  formatLargeNumber,
  normalizeLanguage,
  localizeNumber,
  getLocalizedCurrencySymbol,
  localizeDate
} from '../utils';

describe('utils', () => {
  it('formatLargeNumber format numbers correctly', () => {
    expect(formatLargeNumber()).toEqual({ num: '0.0000', unit: '' });
    expect(formatLargeNumber(2000000000000)).toEqual({ num: '2.0000', unit: 'T' });
    expect(formatLargeNumber(3300000000)).toEqual({ num: '3.3000', unit: 'B' });
    expect(formatLargeNumber(44400000)).toEqual({ num: '44.4000', unit: 'M' });
    expect(formatLargeNumber(555500)).toEqual({ num: '555.5000', unit: 'K' });
    expect(formatLargeNumber(66.666, 2)).toEqual({ num: '66.67', unit: '' });
  });

  it('normalizeLanguage', () => {
    expect(normalizeLanguage()).toEqual('en-US');
    expect(normalizeLanguage('zh')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Hant')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Hans')).toEqual('zh-Hans');
    expect(normalizeLanguage('zh-Ti')).toEqual('zh-Hans');
    expect(normalizeLanguage('ja')).toEqual('ja-JP');
    expect(normalizeLanguage('ja-JP')).toEqual('ja-JP');
    expect(normalizeLanguage('ja-Ti')).toEqual('ja-JP');
    expect(normalizeLanguage('ko')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-KP')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-KR')).toEqual('ko-KP');
    expect(normalizeLanguage('ko-Ti')).toEqual('ko-KP');
    expect(normalizeLanguage('in-IN')).toEqual('en-US');
  });

  it('localizeNumber', () => {
    expect(localizeNumber()).toEqual(null);
    expect(localizeNumber(12.2334, 'en-US', { maximumFractionDigits: 2 })).toEqual('12.23');
    expect(
      localizeNumber(12.2334, 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      })
    ).toEqual('$12.23');
  });

  it('getLocalizedCurrencySymbol', () => {
    expect(getLocalizedCurrencySymbol()).toEqual('$');
    expect(getLocalizedCurrencySymbol('zh-Hans', 'CNY')).toEqual('CN¥');
    expect(getLocalizedCurrencySymbol('ja-JP', 'EUR')).toEqual('€');
    expect(getLocalizedCurrencySymbol('en-US', 'USDT')).toEqual('');
    expect(getLocalizedCurrencySymbol('en-US', 'BTC')).toEqual('₿');
    expect(getLocalizedCurrencySymbol('zh-Hans', 'ETH')).toEqual('ETH');
  });

  it('localizeDate', () => {
    const d = new Date('Tue Mar 20 2018');
    expect(localizeDate()).toEqual(null);
    expect(localizeDate(d)).toEqual('3/20/2018');
  });
});
