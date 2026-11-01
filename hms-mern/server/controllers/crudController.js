// Generic CRUD factory: one controller for every simple module.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const crud = (Model) => ({
  list: async (req, res) => {
    const q = String(req.query.q || '').trim();
    const strings = Object.keys(Model.schema.paths).filter((p) => Model.schema.paths[p].instance === 'String');
    const filter = q ? { $or: strings.map((p) => ({ [p]: new RegExp(esc(q), 'i') })) } : {};
    res.json(await Model.find(filter).sort('-createdAt'));
  },
  create: async (req, res) => res.status(201).json(await Model.create(req.body)),
  update: async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Record not found' });
    res.json(doc);
  },
  remove: async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  }
});
