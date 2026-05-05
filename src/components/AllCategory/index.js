import Button from "@mui/material/Button";
import { TiThMenuOutline } from "react-icons/ti";

const AllCategory = () => {
    return (<>

        <div class="wrapper">
            <Button className="allCatTab">
                <span class="text">ALL CATEGORIES</span>
                <span className="icon1"><TiThMenuOutline /></span>
            </Button>
            <div class="dropdown">
                <ul>
                    <li><a href="/">Electronics</a></li>
                    <li><a href="/">Cloths</a></li>
                    <li><a href="/">Foods</a></li>
                    <li><a href="/">Beauty</a></li>
                    <li><a href="/">Sports</a></li>
                    <li><a href="/">Toys</a></li>
                    <li><a href="/">Automotive</a></li>
                    <li><a href="/">Books</a></li>
                </ul>
            </div>
        </div>

    </>
    )
}

export default AllCategory;