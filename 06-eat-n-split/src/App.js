import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleShowAddFrn() {
    setShowAddFriend(show => !show);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend(friend);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(!showAddFriend);
  }

  function handleSplitBill(id, balance) {
    setFriends(friends => friends.map( friend => {
      if (friend.id === id) {
        const newBalance = friend.balance + balance;
        return {...friend, balance: newBalance};
      }

      return friend;
    } ));

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectedFriend}
        />

        {showAddFriend && <NewFriendForm onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFrn}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      { selectedFriend && <SplitBillForm selectedFriend={selectedFriend} onSplitBill={handleSplitBill} /> }
    </div>
  );
}


function FriendsList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <div className="sidebar">
      <ul>
        { friends.map( friendObj => 
          <Friend
            key={friendObj.id}
            friendObj={friendObj}
            selectedFriend={selectedFriend}
            onSelectFriend={onSelectFriend}
          /> )
        }
      </ul>
    </div>
  );
}


function Friend({ friendObj, selectedFriend, onSelectFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{friendObj.name}</h3>

      { friendObj.balance < 0 &&
        <p className="red">
          You owe {friendObj.name} ${-1 * friendObj.balance}
        </p>
      }
      { friendObj.balance > 0 &&
        <p className="green">
          {friendObj.name} owes you ${friendObj.balance}
        </p>
      }
      { friendObj.balance === 0 &&
        <p className="">
          You and {friendObj.name} are even
        </p>
      }

      <Button onClick={() => onSelectFriend(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}


function NewFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input type="text" value={name} onChange={ e => setName(e.target.value) } autoFocus />

      <label>🌄 Image URL</label>
      <input type="url" value={img}  onChange={ e => setImg(e.target.value) } />

      <Button>Add</Button>
    </form>
  );
}


function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick} >{children}</button>
  );
}


function SplitBillForm({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userBill, setUserBill] = useState("");
  const [whoPays, setWhoPays] = useState("user");

  const friendBill = bill - userBill;

  function handleUserBill(e) {
    const curVal = Number(e.target.value);
    console.log(curVal);
    curVal > bill ? setUserBill(userBill) : setUserBill(curVal);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userBill) return;

    const value = whoPays === "user" ? friendBill : -userBill;
    onSplitBill(selectedFriend.id, value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit} >
      <h2>SPLIT A BILL WITH {selectedFriend.name.toUpperCase()}</h2>

      <label>💰 Bill value</label>
      <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value)) } />

      <label>🧍 Your expense</label>
      <input type="number" value={userBill} onChange={handleUserBill} />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="number" disabled value={friendBill} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value) } >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

