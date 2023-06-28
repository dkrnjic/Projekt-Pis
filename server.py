from flask import Flask, request, jsonify, render_template
import sqlite3
from flask_cors import CORS
import os

base_dir = os.path.abspath(os.path.dirname(__file__))

db_path = "PutovanjaBaza.db1"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute(
    """CREATE TABLE Putovanje
                  (id INTEGER PRIMARY KEY AUTOINCREMENT, destinacija TEXT, datum DATE, aktivnosti TEXT,
                   troskovi REAL, dojmovi TEXT)
               """
)
app = Flask(__name__)
cors = CORS(
    app,
    resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PATCH", "DELETE"]}},
)


@app.route("/")
def hello_world():
    return jsonify({"message": "Hello, World!"})


# Endpoint za kreiranje tablice
@app.route("/create", methods=["POST"])
def kreirajDb():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    # Kreiraj tablicu
    cur.execute(
        """CREATE TABLE Putovanje
                  (id INTEGER PRIMARY KEY AUTOINCREMENT, destinacija TEXT, datum DATE, aktivnosti TEXT,
                   troskovi REAL, dojmovi TEXT)
               """
    )

    return jsonify({"message": "uspjeh"})


# Endpoint za kreiranje putovanja
@app.route("/putovanja", methods=["POST"])
def create_putovanje():
    data = request.get_json()
    destinacija = data["destinacija"]
    datum = data["datum"]
    aktivnosti = data["aktivnosti"]
    troskovi = data["troskovi"]
    dojmovi = data["dojmovi"]

    # Dodaj u tablicu
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO Putovanje (destinacija, datum, aktivnosti, troskovi, dojmovi) VALUES (?, ?, ?, ?, ?)",
        (destinacija, datum, aktivnosti, troskovi, dojmovi),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Putovanje je uspješno kreirano!"})


# Endpoint za dohvacanje svih putovanja iz baze
@app.route("/putovanja", methods=["GET"])
def get_putovanja():
    sort_by = request.args.get("sort")

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Moidifciranje po sortu
    if sort_by == "destinacija":
        query = "SELECT * FROM Putovanje ORDER BY destinacija"
    elif sort_by == "datum":
        query = "SELECT * FROM Putovanje ORDER BY datum"
    elif sort_by == "troskovi":
        query = "SELECT * FROM Putovanje ORDER BY troskovi ASC"
    else:
        query = "SELECT * FROM Putovanje"

    cur.execute(query)
    putovanja = cur.fetchall()
    conn.close()

    putovanja_list = []
    for putovanje in putovanja:
        putovanje_dict = {
            "id": putovanje[0],
            "destinacija": putovanje[1],
            "datum": putovanje[2],
            "aktivnosti": putovanje[3],
            "troskovi": putovanje[4],
            "dojmovi": putovanje[5],
        }
        putovanja_list.append(putovanje_dict)

    return jsonify(putovanja_list)


# Endpoint za dohvacanje putovanja po id-u
@app.route("/putovanja/<int:id>", methods=["GET"])
def get_putovanje(id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT * FROM Putovanje WHERE id = ?", (id,))
    putovanje = cur.fetchone()
    conn.close()

    if putovanje is None:
        return jsonify({"message": "Putovanje nije pronađeno!"}), 404

    putovanje_dict = {
        "id": putovanje[0],
        "destinacija": putovanje[1],
        "datum": putovanje[2],
        "aktivnosti": putovanje[3],
        "troskovi": putovanje[4],
        "dojmovi": putovanje[5],
    }

    return jsonify(putovanje_dict)


# Endpoint za azuriranje putovanja po id-u
@app.route("/putovanja/<int:id>", methods=["PUT"])
def update_putovanje(id):
    data = request.get_json()
    destinacija = data["destinacija"]
    datum = data["datum"]
    aktivnosti = data["aktivnosti"]
    troskovi = data["troskovi"]
    dojmovi = data["dojmovi"]

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT * FROM Putovanje WHERE id = ?", (id,))
    putovanje = cur.fetchone()

    if putovanje is None:
        return jsonify({"message": "Putovanje nije pronađeno!"}), 404

    cur.execute(
        "UPDATE Putovanje SET destinacija = ?, datum = ?, aktivnosti = ?, troskovi = ?, dojmovi = ? WHERE id = ?",
        (destinacija, datum, aktivnosti, troskovi, dojmovi, id),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Putovanje je uspješno ažurirano!"})


# Endpoint za brisanje putovanja po id-u
@app.route("/putovanja/<int:id>", methods=["DELETE"])
def delete_putovanje(id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT * FROM Putovanje WHERE id = ?", (id,))
    putovanje = cur.fetchone()

    if putovanje is None:
        return jsonify({"message": "Putovanje nije pronađeno!"}), 404

    cur.execute("DELETE FROM Putovanje WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Putovanje je uspješno obrisano!"})


# ROOT route
@app.route("/")
def root():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
