import { NavLink } from "react-router-dom";
import "./ChatContact.css";
import { ChatContact } from "../../../models/chat-contact";
import { getUserInfoById, mockMe } from "../../../mockData";

interface ConnectorProps {
    data: ChatContact;
}

function Connector({ data }: ConnectorProps) {
    return (
        <NavLink
            to={data.chatID}
            className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
            }
        >
            <div className="flex justify-between items-center connector  px-6 py-3 ">
                <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                    <div>
                        <p className="font-bold">{data.chatName}</p>
                        <p className={`text-gray-700 text-sm`}>
                            {`${
                                data.lastMassage.senderID === mockMe._id
                                    ? "Me"
                                    : getUserInfoById(data.lastMassage.senderID)
                                          ?.displayName
                            } : ${data.lastMassage.content.data}`}
                        </p>
                    </div>
                </div>
                {/* {!data.isRead ? (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                ) : (
                    ""
                )} */}
            </div>
        </NavLink>
    );
}

export default Connector;
