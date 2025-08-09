import { useParams } from "react-router-dom";

export default function TakeDetail() {
    const { id } = useParams();
    return (
        <div>
            🎯 Take Detail — ID: {id}
        </div>
    );
}