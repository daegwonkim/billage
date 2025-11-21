import hotIcon from '../assets/hot.png'
import hoomIcon from '../assets/home.png'
import travelIcon from '../assets/travel.png'
import sportsIcon from '../assets/sports.png'
import electronicsIcon from '../assets/electronics.png'
import fashionIcon from '../assets/fashion.png'
import granulationIcon from '../assets/granulation.png'

interface Category {
    icon: string;
    label: string;
}

export const categories: Category[] = [
  { icon: hotIcon, label: '인기상품' },
  { icon: hoomIcon, label: '가정용품' },
  { icon: travelIcon, label: '여행용품' },
  { icon: sportsIcon, label: '스포츠/운동' },
  { icon: electronicsIcon, label: '전자제품' },
  { icon: fashionIcon, label: '패션' },
  { icon: granulationIcon, label: '육아/교육' },
];
