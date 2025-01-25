// --------------------------------------------Favourite handler----------------------------------

class FavouriteController {
  async addFavorite(req, res) {
    const {} = req.body;
    try {
      return res.status(200).json({
        message: "place is created successfully",
        success: true,
        user: newuser,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error in creating user",
        success: false,
        error: err.message,
      });
    }
  }
  async removeFavorite(req, res) {
    const { name, id } = req.body;
    try {
      return res.status(200).json({
        message: "place is created successfully",
        success: true,
        user: newuser,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error in creating user",
        success: false,
        error: err.message,
      });
    }
  }
}

export default new FavouriteController();
