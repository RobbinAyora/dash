interface ButtonsProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ selectedTab, onTabSelect }) => {
  return (
    <div className="h-screen sticky top-0 grid grid-rows-5 gap-4 p-4 bg-white w-full">
      <button
        className={`h-[70px] py-2 px-4 rounded border border-black cursor-pointer ${
          selectedTab === 'weather' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'
        }`}
        onClick={() => onTabSelect('weather')}
      >
        Weather
      </button>

      <button
        className={`h-[70px] py-2 px-4 rounded border border-black cursor-pointer ${
          selectedTab === 'news' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'
        }`}
        onClick={() => onTabSelect('news')}
      >
        News
      </button>

      <button
        className={`h-[70px] py-2 px-4 rounded border border-black cursor-pointer ${
          selectedTab === 'donate' ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'
        }`}
        onClick={() => onTabSelect('donate')}
      >
        Donate
      </button>
    </div>
  );
};

export default Buttons;





