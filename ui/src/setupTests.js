import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.ga = window.ga || (() => true);
configure({ adapter: new Adapter() });
