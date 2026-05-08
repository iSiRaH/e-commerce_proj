

const Frame = ({ text = "CatItem1" }) => {
  return (
    <div className="w-full h-[45px] bg-[#ebd9d1] rounded-xl flex items-center px-4 cursor-pointer hover:scale-[1.02] transition-all duration-200">
      <p className="font-medium text-black text-sm md:text-base">
        {text}
      </p>
    </div>
  );
};

export default Frame;