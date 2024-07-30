// import Avatar from '@mui/material/Avatar';
// import Tooltip from '@mui/material/Tooltip';
// import ScrollableFeed from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../../../Context/ChatProvider";

// const ScrollableChat = (message:any) => {
//   const { users } = ChatState();

//   return (
//     <ScrollableFeed>
//       {message &&
//         message.map((m:any, i:any) => (
//           <div style={{ display: "flex" }} key={m._id}>
//             {(isSameSender(message, m, i, users._id) ||
//               isLastMessage(message, i, users._id)) && (
//               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                 <Avatar
//                   mt="7px"
//                   mr={1}
//                   size="sm"
//                   cursor="pointer"
//                   name={m.sender.name}
//                   src={m.sender.pic}
//                 />
//               </Tooltip>
//             )}
//             <span
//               style={{
//                 backgroundColor: `${
//                   m.sender._id === users._id ? "#BEE3F8" : "#B9F5D0"
//                 }`,
//                 marginLeft: isSameSenderMargin(message, m, i, users._id),
//                 marginTop: isSameUser(message, m, i, users._id) ? 3 : 10,
//                 borderRadius: "20px",
//                 padding: "5px 15px",
//                 maxWidth: "75%",
//               }}
//             >
//               {m.content}
//             </span>
//           </div>
//         ))}
//     </ScrollableFeed>
//   );
// };

// export default ScrollableChat;