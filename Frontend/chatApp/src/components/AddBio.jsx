import React from 'react';
import styles from './AddBio.module.css';

function AddBio() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit performed");
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.heading}>Tell us more about you</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <input required autoComplete="off" type="text" name="text" id="bioText" />
            <label htmlFor="bioText">Bio</label>
          </div>
          <div className={styles.inputField}>
            <input required autoComplete="off" type="email" name="email" id="email" />
            <label htmlFor="email">Email</label>
          </div>
          <div className={styles.inputField}>
            <input required autoComplete="off" type="password" name="password" id="password" />
            <label htmlFor="username">Password</label>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.btn}>Submit</button>
            <div className={styles.acc_text}>
              New here?
              <span style={{ color: '#0000ff', cursor: 'pointer' }}>Create Account</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBio;
