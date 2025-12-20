from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime,timedelta
from flask_cors import CORS
import os
import jwt
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "").strip()


def create_app():
    app = Flask(__name__)

    CORS(app)
    # NEW PostgreSQL
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    class Post(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(255), nullable=False)
        slug = db.Column(db.String(255), unique=True, nullable=False)
        content = db.Column(db.Text, nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)


    @app.route("/")
    def index():
        return jsonify({"msg": "Accounting blog API"})

    @app.post("/api/login")
    def login():
        data = request.get_json()
        password = data.get("password")

        if password != ADMIN_PASSWORD:
            return jsonify({"error": "Invalid password"}), 401

        # Create simple token
        token = jwt.encode(
            {"role": "admin", "exp": datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({"token": token})

    from functools import wraps

    def admin_required(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return jsonify({"error": "missing token"}), 401

            try:
                token = auth_header.split(" ")[1]
                decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

                if decoded.get("role") != "admin":
                    return jsonify({"error": "not authorized"}), 403

            except Exception as e:
                return jsonify({"error": "invalid token"}), 401

            return f(*args, **kwargs)
        return wrapper


    @app.route("/api/posts")
    def get_posts():
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return jsonify([
            {
                "id": p.id,
                "title": p.title,
                'slug': p.slug,
                "content": p.content,
                "created_at": p.created_at.isoformat()
            }
            for p in posts
        ])
    
    @app.route("/api/posts/<slug>")
    def get_post(slug):
        post = Post.query.filter_by(slug=slug).first()
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        return jsonify({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "content": post.content,
            "created_at": post.created_at.isoformat()
        })

    
    @app.route("/api/posts", methods=["POST"])
    @admin_required
    def create_post():
        data = request.get_json()
        title = data.get("title")
        content = data.get("content")

        if not title or not content:
            return jsonify({"error": "title and content required"}), 400

        slug = generate_slug(title)
        existing = Post.query.filter_by(slug=slug).first()
        if existing:
            return jsonify({"error": "slug already exists"}), 400

        post = Post(title=title, slug=slug, content=content)
        db.session.add(post)
        db.session.commit()

        return jsonify({"msg": "post created"}), 201

    import re

    def generate_slug(title):
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        return slug.strip('-')


    @app.route("/api/posts/<slug>", methods=["DELETE"])
    @admin_required
    def delete_post(slug):
        post = Post.query.filter_by(slug=slug).first()
        if not post:
            return jsonify({"error": "Post not found"}), 404

        db.session.delete(post)
        db.session.commit()

        return jsonify({"msg": f"Post '{slug}' deleted"}), 200
    

    return app


app = create_app()

# ✅ ALWAYS create tables (safe for Postgres)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run()



