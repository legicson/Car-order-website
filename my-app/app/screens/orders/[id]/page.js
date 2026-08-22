export default async function orderList({params}) {
  const { id } = await params;
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Order List {id}</h1>
    </div>
  );
}
