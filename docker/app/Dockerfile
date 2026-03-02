# python:3.12のスリムイメージをベースに使用
FROM python:3.12-slim

# 作業ディレクトリを/appに設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt .

# pipを使用して必要なPythonパッケージをインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコンテナにコピー
COPY . .

# コンテナ起動時にuvicornを使用してFastAPIアプリケーションを起動
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]