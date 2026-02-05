export default function Footer() {
  return (
    <footer style={{
      padding: "30px 80px",
      background: "#f5f2ed",
      display: "flex",
      justifyContent: "space-between",
      color: "black",
    }}>
      <div>
        <p>Driving School System</p>
        <p>Always ready to accompany you</p>
      </div>
      <div>
        <p>Address: 123 Main St, City, Country</p>
        <p>Working Hours: Mon - Fri, 8:00 AM - 6:00 PM</p>
      </div>
      <div>
        <p>Email: support@driving.com</p>
        <p>Phone: 0123 456 789</p>
      </div>
    </footer>
  );
}
