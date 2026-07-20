import React from 'react'
import styles from './FilterSidebar.module.css'
import { StarRating } from '../common/StarRating'

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedColor,
  onColorChange,
}) {
  const colors = [
    { id: 'darkgray', value: '#2c3230' },
    { id: 'lightgray', value: '#eaefec' },
    { id: 'green', value: '#00685c' },
    { id: 'brown', value: '#95442b' },
    { id: 'orange', value: '#c7701e' },
  ]

  return (
    <aside className={styles.sidebar}>
      {/* Category */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Category</h3>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedCategory.electronics}
              onChange={(e) => onCategoryChange('electronics', e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>Electronics</span>
            <span className={styles.countBadge}>142</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedCategory.accessories}
              onChange={(e) => onCategoryChange('accessories', e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>Accessories</span>
            <span className={styles.countBadge}>84</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedCategory.apparel}
              onChange={(e) => onCategoryChange('apparel', e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>Apparel</span>
            <span className={styles.countBadge}>216</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Price Range</h3>
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="0"
            max="2500"
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className={styles.rangeInput}
            style={{
              background: `linear-gradient(to right, #00685c 0%, #00685c ${(priceRange / 2500) * 100}%, #dde7e4 ${(priceRange / 2500) * 100}%, #dde7e4 100%)`
            }}
          />
          <div className={styles.priceBoxes}>
            <span className={styles.priceBox}>$0</span>
            <span className={styles.priceSeparator}>—</span>
            <span className={styles.priceBox}>${priceRange.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Rating</h3>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input type="radio" name="rating-filter" className={styles.radioInput} defaultChecked />
            <span className={styles.customRadio} />
            <div className={styles.starsWrapper}>
              <StarRating rating={5} />
            </div>
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="rating-filter" className={styles.radioInput} />
            <span className={styles.customRadio} />
            <div className={styles.starsWrapper}>
              <StarRating rating={4} />
              <span className={styles.ratingText}>&amp; Up</span>
            </div>
          </label>
        </div>
      </div>

      {/* Color */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Color</h3>
        <div className={styles.colorSwatches}>
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`${styles.colorSwatch} ${selectedColor === color.id ? styles.colorSwatchActive : ''}`}
              style={{ '--swatch-color': color.value }}
              onClick={() => onColorChange(color.id)}
              aria-label={`Filter by ${color.id}`}
            />
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Brand</h3>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkboxInput} />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>NexGen Tech</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkboxInput} />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>Aura Acoustics</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkboxInput} />
            <span className={styles.customCheckbox} />
            <span className={styles.labelText}>Minimalist.</span>
          </label>
        </div>
      </div>
    </aside>
  )
}
