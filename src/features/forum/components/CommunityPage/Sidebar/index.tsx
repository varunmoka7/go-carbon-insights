import React from 'react';
import Navigation from './Navigation';
import Categories from './Categories';
import Tags from './Tags';
import Channels from './Channels';
import DMs from './DMs';

const Sidebar: React.FC = () => {
  return (
    <div className="p-6 text-gray-300">
      <Navigation />
      <Categories />
      <Tags />
      <Channels />
      <DMs />
    </div>
  );
};

export default Sidebar; 