import { RiHome3Line } from "react-icons/ri";
import { AiOutlineShop } from "react-icons/ai";
import { GiCircuitry } from "react-icons/gi";
import { GiHotDog } from "react-icons/gi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaMobileScreenButton } from "react-icons/fa6";
import { PiMicrophoneStageLight } from "react-icons/pi";





import { Link } from "react-router-dom";
import AllCategory from "../AllCategory";



const Navigation = () => {
    return (
        <nav>
            <div className="container">
                <div className="row">
                    <div className="col-sm-3 navPart1">
                        <AllCategory />
                    </div>

                    <div className="col-sm-9 navPart2 d-flex align-items-center">
                        <ul className="list list-inline ml-alto">
                            <li className="list-inline-item">
                                <Link to="/"><RiHome3Line /> &nbsp; Home</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><AiOutlineShop /> &nbsp;  Shop</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><GiCircuitry />
&nbsp; Electronics</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><GiHotDog />
 &nbsp;Bakery</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"> <RiShoppingBag3Line />
 &nbsp;Grocery</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><PiMicrophoneStageLight />
&nbsp; Blog</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/"><FaMobileScreenButton />
&nbsp; Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navigation;