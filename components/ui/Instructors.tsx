import styles from "@/styles/instructors.module.css";

const instructors = [
  {
    id: 1,
    name: "Tran Van A",
    level: "Instructor Level A",
    exp: "5 years of experience, specialized in urban driving techniques.",
    image: "/instructor-1.jpg",
  },
  {
    id: 2,
    name: "Tran Van B",
    level: "Instructor Level B",
    exp: "7 years of experience, specialized in highway driving techniques.",
    image: "/instructor-2.jpg",
  },
  {
    id: 3,
    name: "Tran Van C",
    level: "Instructor Level C",
    exp: "7 years of experience , specialized in defensive driving techniques.",
    image: "/instructor-3.jpg",
  },
  {
    id: 4,
    name: "Tran Van C",
    level: "Instructor Level C",
    exp: "6 years of experience, specialized in night driving techniques.",
    image: "/instructor-1.jpg",
  },
  {
    id: 5,
    name: "Tran Van C",
    level: "Instructor Level C",
    exp: "10 years of experience , specialized in off-road driving techniques.",
    image: "/instructor-2.jpg",
  },
  {
    id: 6,
    name: "Tran Van C",
    level: "Instructor Level C",
    exp: "10 years of experience, specialized in advanced driving techniques.",
    image: "/instructor-3.jpg",
  },
];

export default function Instructors() {
  return (
    <section className={styles.wrapper}>
      {instructors.map((i) => (
        <div className={styles.card} key={i.id}>
          <div className={styles.left}>
            <img src={i.image} alt={i.name} />
          </div>

          <div className={styles.right}>
            <p className={styles.desc}>
              {i.exp}
            </p>

            <button className={styles.btn}>
              View Profile
            </button>
          </div>
        </div>

      ))}
    </section>
  );
}
