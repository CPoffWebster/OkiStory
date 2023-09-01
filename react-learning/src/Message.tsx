// PascalCasing
function Message() {
    // JSX: JavaScript XML
    return <h1>Hello World! {getName()}</h1>
}

function getName() {
    const name = 'Charlie';
    return name;
}

export default Message;